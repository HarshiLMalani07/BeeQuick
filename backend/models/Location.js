const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  loc_id: { type: String, required: true, unique: true },
  loc_name: { type: String, required: true },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Location', LocationSchema);
