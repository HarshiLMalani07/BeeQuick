const express = require('express');
const Location = require('../models/Location');
const router = express.Router();

// Create a new location
router.post('/create', async (req, res) => {
  const { loc_id, loc_name, longitude, latitude } = req.body;

  try {
    // Check if the location ID already exists
    const existingLocation = await Location.findOne({ loc_id });
    if (existingLocation) {
      return res.status(400).json({ message: 'Location ID already exists' });
    }

    // Create and save the new location
    const newLocation = new Location({ loc_id, loc_name, longitude, latitude });
    await newLocation.save();

    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single location by ID
router.get('/:id', async (req, res) => {
  try {
    console.log(typeof(req.params.id));
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search locations by query
// router.get('/search', async (req, res) => {
//   const query = req.query.query;

//   if (!query) {
//     return res.status(400).json({ message: 'Query is required' });
//   }

//   try {
//     // Search by location ID or name (you can customize this as needed)
//     console.log(query);
//     // const locations = await Location.find({
      // $or: [
      //   { loc_id: { $regex: query, $options: 'i' } },
      //   { loc_name: { $regex: query, $options: 'i' } }
      // ]
//     // });

//     // res.json(locations);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// routes/locations.js

// Route to search for locations by name
router.post('/search', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    // Search for locations by name, case-insensitive
    const locations = await Location.find({
      $or: [
        { loc_id: { $regex: query, $options: 'i' } },
        { loc_name: { $regex: query, $options: 'i' } }
      ]
    });

    if (locations.length === 0) {
      return res.status(404).json({ message: 'No locations found' });
    }

    res.json(locations);
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});




router.post('/locid', async (req, res) => {
  const { loc_id } = req.body;

  if (!loc_id) {
    return res.status(400).json({ message: 'Location ID is required' });
  }

  try {
    // Find the location by loc_id to get the ObjectId
    const location = await Location.findOne({ loc_id });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/pickuplocid', async (req, res) => {
  const { loc_pick } = req.body;
  // console.log(loc_pick);

  if (!loc_pick) {
    return res.status(400).json({ message: 'Location ID is required' });
  }

  try {
    // Find the location by loc_id to get the ObjectId
    const location = await Location.findById( loc_pick );

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/droplocid', async (req, res) => {
  const { loc_drop } = req.body;
  // console.log(loc_pick);

  if (!loc_drop) {
    return res.status(400).json({ message: 'Location ID is required' });
  }

  try {
    // Find the location by loc_id to get the ObjectId
    const location = await Location.findById( loc_drop );

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update a location
router.put('/:id', async (req, res) => {
  const { loc_id, loc_name } = req.body;

  try {
    // Check if the location ID already exists for a different document
    const existingLocation = await Location.findOne({ loc_id });
    if (existingLocation && existingLocation._id.toString() !== req.params.id) {
      return res.status(400).json({ message: 'Location ID already exists' });
    }

    // Update the location
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      { loc_id, loc_name },
      { new: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a location
router.delete('/:id', async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    if (!deletedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
