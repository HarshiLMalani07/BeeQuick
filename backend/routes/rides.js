const express = require('express');
const Ride = require('../models/Ride');
const User = require('../models/User');
const Bicycle = require('../models/Bicycle');
const Location = require('../models/Location');
const router = express.Router();

// Utility function to calculate ride cost based on time difference
const calculateCost = (time_pick, time_drop) => {
  const diffInMinutes = Math.ceil((new Date(time_drop) - new Date(time_pick)) / 60000);
  if (diffInMinutes <= 30) return 5;
  return 5 + Math.ceil((diffInMinutes - 30) / 30) * 5;
};

// Create a new ride
router.post('/create', async (req, res) => {
  const { username, bikeId, loc_pick, loc_drop, time_pick, time_drop } = req.body;

  try {
    // Ensure the user, bicycle, and locations exist
    const user = await User.findById(username);
    const bicycle = await Bicycle.findById(bikeId);
    const pickLocation = await Location.findById(loc_pick);
    const dropLocation = await Location.findById(loc_drop);

    if (!user || !bicycle || !pickLocation || !dropLocation) {
      return res.status(404).json({ message: 'Invalid data provided' });
    }

    // Ensure the bicycle is available
    if (!bicycle.availability) {
      return res.status(400).json({ message: 'Bicycle is not available' });
    }

    // Calculate the ride cost
    const amount = calculateCost(time_pick, time_drop);

    // Create and save the new ride
    const newRide = new Ride({
      username,
      bikeId,
      loc_pick,
      loc_drop,
      time_pick,
      time_drop,
      amount,
    });
    await newRide.save();

    // Mark the bicycle as unavailable
    bicycle.availability = false;
    await bicycle.save();

    res.status(201).json(newRide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find().populate('username bikeId loc_pick loc_drop');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single ride by ID
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('username bikeId loc_pick loc_drop');
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a ride
router.put('/:id', async (req, res) => {
  const { time_drop } = req.body;

  try {
    // Find the ride and update the time_drop and amount
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    ride.time_drop = time_drop;
    ride.amount = calculateCost(ride.time_pick, time_drop);

    await ride.save();
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a ride
router.delete('/:id', async (req, res) => {
  try {
    const deletedRide = await Ride.findByIdAndDelete(req.params.id);
    if (!deletedRide) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Mark the bicycle as available
    const bicycle = await Bicycle.findById(deletedRide.bikeId);
    if (bicycle) {
      bicycle.availability = true;
      await bicycle.save();
    }

    res.json({ message: 'Ride deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
