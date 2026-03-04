// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  // Booking Details
  packageTitle: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  packageImage: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  // Traveler Information
  travelerName: {
    type: String,
    required: true,
  },
  travelerEmail: {
    type: String,
    required: true,
  },
  travelerPhone: {
    type: String,
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  // Dates
  travelDate: {
    type: Date,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  // Pricing
  pricePerPerson: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet'],
  },
  transactionId: String,
  // Status
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  cancellationReason: String,
  cancelledAt: Date,
  // Special Requests
  specialRequests: String,
  // Agent Info
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
  },
  agentName: String,
}, {
  timestamps: true,
});

// Generate unique booking ID BEFORE validation
bookingSchema.pre('validate', function(next) {
  if (!this.bookingId) {
    this.bookingId = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Virtual for days until travel
bookingSchema.virtual('daysUntilTravel').get(function() {
  const now = new Date();
  const travel = new Date(this.travelDate);
  const diffTime = travel - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for is upcoming
bookingSchema.virtual('isUpcoming').get(function() {
  return this.daysUntilTravel > 0 && this.status === 'confirmed';
});

// Virtual for is past
bookingSchema.virtual('isPast').get(function() {
  return this.daysUntilTravel < 0 || this.status === 'completed';
});

bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

export default mongoose.model('Booking', bookingSchema);