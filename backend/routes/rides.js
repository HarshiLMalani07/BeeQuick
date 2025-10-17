const express = require('express');
const Ride = require('../models/Ride');
const User = require('../models/User');
const Bicycle = require('../models/Bicycle');
const Location = require('../models/Location');
const router = express.Router();
const mongoose = require('mongoose');

// Utility function to calculate ride cost based on time difference
const calculateCost = (time_pick, time_drop) => {
  const diffInMinutes = Math.ceil(
    (new Date(time_drop) - new Date(time_pick)) / 60000,
  );
  if (diffInMinutes <= 30) return 5;
  return 5 + Math.ceil((diffInMinutes - 30) / 30) * 5;
};

// Get available bicycles at a pickup location
router.get('/available-bicycles', async (req, res) => {
  const {loc_pick} = req.query;

  try {
    // Check if the location exists
    const location = await Location.findById(loc_pick);
    if (!location) return res.status(404).json({message: 'Location not found'});

    const bicycles = await Bicycle.find({
      location: loc_pick,
      availability: true,
    });
    if (bicycles.length === 0) {
      return res
        .status(404)
        .json({message: 'No available bicycles at this location'});
    }
    res.json(bicycles);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

router.post('/create', async (req, res) => {
  const {username, bikeId, loc_pick} = req.body;

  try {
    const user = await User.findById(username);
    const bicycle = await Bicycle.findById(bikeId);
    const pickLocation = await Location.findById(loc_pick);

    if (!user || !bicycle || !pickLocation) {
      return res.status(404).json({message: 'Invalid data provided'});
    }

    if (!bicycle.availability || bicycle.loc_avail.toString() !== loc_pick) {
      return res
        .status(400)
        .json({message: 'Bicycle is not available at this location'});
    }

    const time_pick = new Date(); // Record the current time as pickup time

    const newRide = new Ride({
      username,
      bikeId,
      loc_pick,
      time_pick,
      amount: 0, // Initial amount will be calculated later
    });
    await newRide.save();

    // Mark the bicycle as unavailable
    bicycle.availability = false;
    await bicycle.save();

    res.status(201).json(newRide);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// End a ride
router.put('/end', async (req, res) => {
  const {rideId, loc_drop} = req.body;

  try {
    // Find the ride
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({message: 'Ride not found'});
    }

    const dropLocation = await Location.findById(loc_drop);
    if (!dropLocation) {
      return res.status(404).json({message: 'Invalid drop location'});
    }

    const time_drop = new Date(); // Record the current time as drop time
    ride.time_drop = time_drop;
    ride.loc_drop = loc_drop;
    ride.amount = calculateCost(ride.time_pick, time_drop);

    await ride.save();

    // Mark the bicycle as available at the new location
    const bicycle = await Bicycle.findById(ride.bikeId);
    if (bicycle) {
      bicycle.availability = true;
      bicycle.loc_avail = loc_drop;
      await bicycle.save();
    }

    res.json(ride);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Get rides for a specific user
router.get('/user/:username', async (req, res) => {
  const {username} = req.params;
  // router.get('/user', async (req, res) => {
    //   const { username } = req.body;
    //   // console.log(username);
  try {
    const rides = await Ride.find({username}).populate(
      'username bikeId loc_pick loc_drop',
    );
    if (rides.length === 0) {
      return res.status(404).json({message: 'No rides found for this user'});
    }
    res.json(rides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({message: error.message});
  }
});

// Alternatively, if you want to use user ID
router.post('/user/id', async (req, res) => {
  const {id} = req.body;
  try {
    const rides = await Ride.find({username: id}).populate(
      'username bikeId loc_pick loc_drop',
    );
    if (rides.length === 0) {
      return res.status(404).json({message: 'No rides found for this user'});
    }
    return res.json(rides);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
});

// Get all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find().populate(
      'username bikeId loc_pick loc_drop',
    );
    res.json(rides);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Get a single ride by ID
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate(
      'username bikeId loc_pick loc_drop',
    );
    if (!ride) {
      return res.status(404).json({message: 'Ride not found'});
    }
    res.json(ride);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Update a ride
router.put('/:id', async (req, res) => {
  const {time_drop} = req.body;

  try {
    // Find the ride and update the time_drop and amount
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({message: 'Ride not found'});
    }

    ride.time_drop = time_drop;
    ride.amount = calculateCost(ride.time_pick, time_drop);

    await ride.save();
    res.json(ride);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Delete a ride
router.delete('/:id', async (req, res) => {
  try {
    const deletedRide = await Ride.findByIdAndDelete(req.params.id);
    if (!deletedRide) {
      return res.status(404).json({message: 'Ride not found'});
    }

    // Mark the bicycle as available
    const bicycle = await Bicycle.findById(deletedRide.bikeId);
    if (bicycle) {
      bicycle.availability = true;
      await bicycle.save();
    }

    res.json({message: 'Ride deleted successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

module.exports = router;
