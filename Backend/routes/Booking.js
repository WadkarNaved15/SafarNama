// routes/bookingRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import { User } from '../models/User.js';
import jwt from "jsonwebtoken";
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const router = express.Router();

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};


/**
 * @route   POST /api/v1/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', verifyUser, async (req, res) => {
  try {
    const {
      packageId,
      numberOfGuests,
      travelDate,
      travelerName,
      travelerEmail,
      travelerPhone,
      specialRequests,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (!packageId || !numberOfGuests || !travelDate || !travelerName || !travelerEmail || !travelerPhone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get package details
    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Calculate pricing
    const pricePerPerson = packageData.price;
    const totalAmount = pricePerPerson * numberOfGuests;
    const discount = packageData.originalPrice 
      ? (packageData.originalPrice - packageData.price) * numberOfGuests 
      : 0;

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      package: packageId,
      packageTitle: packageData.title,
      destination: packageData.destination,
      packageImage: packageData.image,
      duration: packageData.duration,
      travelerName,
      travelerEmail,
      travelerPhone,
      numberOfGuests,
      travelDate: new Date(travelDate),
      pricePerPerson,
      totalAmount,
      discount,
      specialRequests,
      paymentMethod,
      paymentStatus: 'pending', // not completed until payment gateway confirms
      status: 'confirmed',
      agentId: packageData.agent,
      agentName: packageData.agentName,
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

/**
 * @route   GET /api/v1/bookings/my-bookings
 * @desc    Get logged-in user's bookings
 * @access  Private
 */
router.get('/my-bookings', verifyUser, async (req, res) => {
  try {
    const { status, type } = req.query;

    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (type === 'upcoming') {
      query.travelDate = { $gte: new Date() };
      query.status = { $in: ['confirmed', 'pending'] };
    }

    if (type === 'past') {
      query.$or = [
        { travelDate: { $lt: new Date() } },
        { status: 'completed' }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('package')
      .sort({ travelDate: -1 });

    // Add daysUntilTravel calculation
    const bookingsWithCountdown = bookings.map(b => {
      const today = new Date();
      const travel = new Date(b.travelDate);
      const diff = Math.ceil((travel - today) / (1000 * 60 * 60 * 24));

      return {
        ...b.toObject(),
        daysUntilTravel: diff > 0 ? diff : 0
      };
    });

    res.json({
      success: true,
      data: bookingsWithCountdown
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

/**
 * @route   POST /api/v1/bookings/create-order
 * @desc    Create a Razorpay order before booking. No DB write happens here.
 * @access  Private
 *
 * ⚠️  Defined BEFORE /:bookingId — otherwise Express treats the literal
 *     string "create-order" as a bookingId param and this route is never reached.
 */
router.post('/create-order', verifyUser, async (req, res) => {
  try {
    const { packageId, numberOfGuests } = req.body;

    if (!packageId || !numberOfGuests) {
      return res.status(400).json({ error: 'packageId and numberOfGuests are required' });
    }

    const packageData = await Package.findById(packageId);
    if (!packageData) return res.status(404).json({ error: 'Package not found' });

    const totalAmount = packageData.price * numberOfGuests;

    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // paise; Math.round avoids float precision issues
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        packageId: packageId.toString(),
        userId: req.user._id.toString(),
        numberOfGuests: numberOfGuests.toString(),
      },
    });

    res.json({ success: true, order, amount: totalAmount });
  } catch (error) {
    console.error('Razorpay order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});


/**
 * @route   POST /api/v1/bookings/verify-payment
 * @desc    Verify Razorpay HMAC signature then atomically create the booking.
 *          Nothing is written to DB unless the signature matches.
 * @access  Private
 *
 * ⚠️  Defined BEFORE /:bookingId for the same routing reason above.
 *
 * Atomicity:
 *   1. Signature check    — mismatch → 400, no DB write.
 *   2. Idempotency check  — duplicate call with same payment_id → return
 *                           existing booking, no second write.
 *   3. booking.save()     — only reached when both checks pass.
 */
router.post('/verify-payment', verifyUser, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      packageId,
      numberOfGuests,
      travelDate,
      travelerName,
      travelerEmail,
      travelerPhone,
      specialRequests,
    } = req.body;

    // 1. Validate all required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing Razorpay payment fields' });
    }
    if (!packageId || !numberOfGuests || !travelDate || !travelerName || !travelerEmail || !travelerPhone) {
      return res.status(400).json({ error: 'Missing booking fields' });
    }

    // 2. Verify HMAC-SHA256 signature
    // Razorpay signs: order_id + "|" + payment_id using your key_secret
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Possible tampered request — do NOT save a booking
      console.warn('Razorpay signature mismatch for order:', razorpay_order_id);
      return res.status(400).json({ error: 'Payment verification failed. Booking not created.' });
    }

    // 3. Idempotency — prevent duplicate bookings on double-submit / network retry
    const existing = await Booking.findOne({ transactionId: razorpay_payment_id });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Booking already confirmed',
        booking: existing,
      });
    }

    // 4. Fetch package (re-validate it still exists at time of booking)
    const packageData = await Package.findById(packageId);
    if (!packageData) return res.status(404).json({ error: 'Package not found' });

    // 5. Create booking — only reached when signature is valid
    const pricePerPerson = packageData.price;
    const totalAmount = pricePerPerson * numberOfGuests;
    const discount = packageData.originalPrice
      ? (packageData.originalPrice - packageData.price) * numberOfGuests
      : 0;

    const booking = new Booking({
      user: req.user._id,
      package: packageId,
      packageTitle: packageData.title,
      destination: packageData.destination,
      packageImage: packageData.image,
      duration: packageData.duration,
      travelerName,
      travelerEmail,
      travelerPhone,
      numberOfGuests,
      travelDate: new Date(travelDate),
      pricePerPerson,
      totalAmount,
      discount,
      specialRequests,
      paymentMethod: 'razorpay',
      paymentStatus: 'completed',
      status: 'confirmed',
      agentId: packageData.agent,
      agentName: packageData.agentName,
      transactionId: razorpay_payment_id,   // Razorpay payment_id as canonical ref
      razorpayOrderId: razorpay_order_id,   // keep order_id for reconciliation
    });

    await booking.save();

    res.status(201).json({ success: true, message: 'Booking confirmed', booking });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});


/**
 * @route   GET /api/v1/bookings/user/:userId
 * @desc    Get all bookings for a user
 * @access  Private
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, type } = req.query;

    const query = { user: userId };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by type (upcoming/past)
    if (type === 'upcoming') {
      query.travelDate = { $gte: new Date() };
      query.status = { $in: ['confirmed', 'pending'] };
    } else if (type === 'past') {
      query.$or = [
        { travelDate: { $lt: new Date() } },
        { status: 'completed' }
      ];
    }

    const bookings = await Booking.find(query)
      .populate('package')
      .sort({ travelDate: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

/**
 * @route   GET /api/v1/bookings/user/:userId/stats
 * @desc    Get user booking statistics
 * @access  Private
 */
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    const [totalBookings, upcomingBookings, completedBookings, cancelledBookings] = await Promise.all([
      Booking.countDocuments({ user: userId }),
      Booking.countDocuments({ 
        user: userId, 
        status: 'confirmed',
        travelDate: { $gte: new Date() }
      }),
      Booking.countDocuments({ user: userId, status: 'completed' }),
      Booking.countDocuments({ user: userId, status: 'cancelled' }),
    ]);

    const totalSpent = await Booking.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(userId),
          paymentStatus: 'completed'
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$totalAmount' } 
        } 
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalBookings,
        upcomingBookings,
        completedBookings,
        cancelledBookings,
        totalSpent: totalSpent[0]?.total || 0,
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * @route   GET /api/v1/bookings/:bookingId
 * @desc    Get single booking details
 * @access  Private
 *
 * ⚠️  Keep this AFTER all specific named routes — the :bookingId wildcard
 *     will swallow any path segment placed after it if declared earlier.
 */
router.get('/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('package')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

/**
 * @route   PATCH /api/v1/bookings/:bookingId/cancel
 * @desc    Cancel a booking
 * @access  Private
 */
router.patch('/:bookingId/cancel', verifyUser, async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    // Update booking
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();
    booking.paymentStatus = 'refunded';

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;