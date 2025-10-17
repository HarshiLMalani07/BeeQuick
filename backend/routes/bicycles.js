const express = require('express');
const Bicycle = require('../models/Bicycle');
const Location = require('../models/Location');
const {default: mongoose} = require('mongoose');
const router = express.Router();
const User = require('../models/User');

router.post('/available', async (req, res) => {
  const {loc_id, user_id} = req.body;
  if (!user_id) {
    return res.status(400).json({message: 'User ID is required'});
  }
  const user = await User.findById(user_id);
  if (user.balance < 50) {
    return res.status(200).json('balance is zero');
  }
  if (!loc_id) {
    return res.status(400).json({message: 'Location ID is required'});
  }

  try {
    const locId = loc_id.toString();
    // Find the location by loc_id to get the ObjectId
    const location = await Location.findOne({loc_id: locId});

    if (!location) {
      return res.status(404).json({message: 'Location not found'});
    }

    // Find bicycles that are available at the specified location ObjectId
    const availableBicycles = await Bicycle.find({
      loc_avail: location._id,
      availability: true, // Assuming you have an 'availability' field in your Bicycle model
    }).populate('loc_avail');

    return res.status(200).json(availableBicycles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Server error'});
  }
});

router.post('/get-bikeid', async (req, res) => {
  const {bikeId} = req.body;
  // console.log(bikeId);

  if (!bikeId) {
    return res.status(400).json({message: 'User ID is required'});
  }

  try {
    const bike = await Bicycle.findById(bikeId);

    if (!bike) {
      return res.status(404).json({message: 'User not found'});
    }

    res.json(bike);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Create a new bicycle
router.post('/create', async (req, res) => {
  const {bikeId, availability, loc_avail} = req.body;

  try {
    // Ensure the location exists
    const location = await Location.findOne({loc_name: loc_avail});
    if (!location) {
      return res.status(404).json({message: 'Location not found'});
    }

    const newBicycle = new Bicycle({
      bikeId,
      availability,
      loc_avail: locationId,
    });
    const savedBicycle = await newBicycle.save();

    // Respond with the created bicycle and a success message
    res.status(201).json({
      message: 'Bicycle created successfully',
      bicycle: savedBicycle,
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Get all bicycles
router.get('/', async (req, res) => {
  try {
    const bicycles = await Bicycle.find().populate('loc_avail');
    res.json(bicycles);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Get a single bicycle by ID
router.get('/:id', async (req, res) => {
  try {
    const bicycle = await Bicycle.findById(req.params.id).populate('loc_avail');
    if (!bicycle) {
      return res.status(404).json({message: 'Bicycle not found'});
    }
    res.json(bicycle);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Update a bicycle's availability
router.put('/:id', async (req, res) => {
  const {availability, loc_avail} = req.body;

  try {
    // Ensure the location exists
    // if (loc_avail) {  here the bikeId will be cheked if exists then but there is no point of checking that because we have bike objectID in url
    const location = await Location.findById(loc_avail);
    if (!location) {
      return res.status(404).json({message: 'Location not found'});
    }
    // }

    // Update the bicycle
    const updatedBicycle = await Bicycle.findByIdAndUpdate(
      req.params.id,
      {availability, loc_avail},
      {new: true},
      {availability, loc_avail},
      {new: true},
    ).populate('loc_avail');

    if (!updatedBicycle) {
      return res.status(404).json({message: 'Bicycle not found'});
    }

    res.json(updatedBicycle);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Delete a bicycle
router.delete('/:id', async (req, res) => {
  try {
    const deletedBicycle = await Bicycle.findByIdAndDelete(req.params.id);
    if (!deletedBicycle) {
      return res.status(404).json({message: 'Bicycle not found'});
    }
    res.json({message: 'Bicycle deleted successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

module.exports = router;
