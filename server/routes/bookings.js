const express = require('express');
const Booking = require('../models/Booking');
const Bike = require('../models/Bike');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create new booking
router.post('/', auth, async (req, res) => {
  try {
    const { bikeId, startTime, endTime, totalPrice } = req.body;
    
    console.log('Booking request:', { bikeId, startTime, endTime, totalPrice, userId: req.user._id });
    
    // Check if bike exists
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    
    // Check if bike is available for the requested time (REAL-TIME CONFLICT CHECK)
    const requestStart = new Date(startTime);
    const requestEnd = new Date(endTime);
    
    const conflictingBooking = await Booking.findOne({
      bikeId,
      paymentStatus: 'completed',
      $or: [
        // Case 1: New booking starts during an existing booking
        {
          startTime: { $lte: requestStart },
          endTime: { $gt: requestStart }
        },
        // Case 2: New booking ends during an existing booking
        {
          startTime: { $lt: requestEnd },
          endTime: { $gte: requestEnd }
        },
        // Case 3: New booking completely contains an existing booking
        {
          startTime: { $gte: requestStart },
          endTime: { $lte: requestEnd }
        },
        // Case 4: Existing booking completely contains the new booking
        {
          startTime: { $lte: requestStart },
          endTime: { $gte: requestEnd }
        }
      ]
    });
    
    if (conflictingBooking) {
      console.log('Booking conflict found:', conflictingBooking);
      return res.status(400).json({ 
        message: 'Bike is not available for the selected time period',
        conflictingBooking: {
          startTime: conflictingBooking.startTime,
          endTime: conflictingBooking.endTime,
          bookedBy: conflictingBooking.userId
        }
      });
    }
    
    // Create booking
    const booking = new Booking({
      userId: req.user._id,
      bikeId,
      bikeName: bike.name,
      startTime: requestStart,
      endTime: requestEnd,
      totalPrice,
      paymentStatus: 'completed' // Simplified payment - always successful
    });
    
    await booking.save();
    console.log('Booking created successfully:', booking._id);
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('bikeId', 'name imageUrl')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings (Admin only)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('bikeId', 'name imageUrl')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('bikeId', 'name imageUrl location')
      .populate('userId', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user owns this booking or is admin
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user owns this booking or is admin
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if booking can be cancelled (not started yet)
    if (new Date(booking.startTime) <= new Date()) {
      return res.status(400).json({ message: 'Cannot cancel booking that has already started' });
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;