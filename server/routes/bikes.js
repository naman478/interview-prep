const express = require('express');
const Bike = require('../models/Bike');
const Booking = require('../models/Booking');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all bikes with availability check
router.get('/', async (req, res) => {
  try {
    const bikes = await Bike.find();
    
    // Check current bookings to update availability (REAL-TIME CHECK)
    const currentTime = new Date();
    
    // Get all active bookings for all bikes at once (more efficient)
    const activeBookings = await Booking.find({
      startTime: { $lte: currentTime },
      endTime: { $gte: currentTime },
      paymentStatus: 'completed'
    });
    
    // Create a map of bike IDs to their booking status
    const bookedBikeIds = new Set(activeBookings.map(booking => booking.bikeId.toString()));
    
    // Update availability for each bike
    const bikesWithAvailability = bikes.map(bike => {
      const bikeObj = bike.toObject();
      bikeObj.isAvailable = !bookedBikeIds.has(bike._id.toString());
      return bikeObj;
    });
    
    console.log(`Found ${activeBookings.length} active bookings affecting ${bookedBikeIds.size} bikes`);
    
    res.json(bikesWithAvailability);
  } catch (error) {
    console.error('Error fetching bikes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single bike with availability check
router.get('/:id', async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    
    // Check if bike is currently booked (REAL-TIME CHECK)
    const currentTime = new Date();
    const activeBooking = await Booking.findOne({
      bikeId: bike._id,
      startTime: { $lte: currentTime },
      endTime: { $gte: currentTime },
      paymentStatus: 'completed'
    });
    
    const bikeObj = bike.toObject();
    bikeObj.isAvailable = !activeBooking;
    
    if (activeBooking) {
      console.log(`Bike ${bike.name} is currently booked until ${activeBooking.endTime}`);
    }
    
    res.json(bikeObj);
  } catch (error) {
    console.error('Error fetching bike:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check bike availability for specific time period
router.post('/check-availability', async (req, res) => {
  try {
    const { bikeId, startTime, endTime } = req.body;
    
    const requestStart = new Date(startTime);
    const requestEnd = new Date(endTime);
    
    const conflictingBooking = await Booking.findOne({
      bikeId,
      paymentStatus: 'completed',
      $or: [
        {
          startTime: { $lte: requestStart },
          endTime: { $gt: requestStart }
        },
        {
          startTime: { $lt: requestEnd },
          endTime: { $gte: requestEnd }
        },
        {
          startTime: { $gte: requestStart },
          endTime: { $lte: requestEnd }
        },
        {
          startTime: { $lte: requestStart },
          endTime: { $gte: requestEnd }
        }
      ]
    });
    
    res.json({
      available: !conflictingBooking,
      conflictingBooking: conflictingBooking ? {
        startTime: conflictingBooking.startTime,
        endTime: conflictingBooking.endTime
      } : null
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new bike (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const bike = new Bike(req.body);
    await bike.save();
    res.status(201).json(bike);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update bike (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const bike = await Bike.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    
    res.json(bike);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete bike (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const bike = await Bike.findByIdAndDelete(req.params.id);
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }
    
    // Also delete all bookings for this bike
    await Booking.deleteMany({ bikeId: req.params.id });
    
    res.json({ message: 'Bike deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;