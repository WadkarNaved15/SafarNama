// routes/bookingRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import { User } from '../models/User.js';
import jwt from "jsonwebtoken";

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
      paymentStatus: 'completed', // In production, integrate payment gateway
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
 * @route   GET /api/v1/bookings/:bookingId
 * @desc    Get single booking details
 * @access  Private
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

export default router;
