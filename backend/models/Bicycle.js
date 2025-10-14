const mongoose = require('mongoose');

const BicycleSchema = new mongoose.Schema({
  bikeId: { type: String, required: true, unique: true },
  availability: { type: Boolean, required: true },
  loc_avail: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
});

module.exports = mongoose.model('Bicycle', BicycleSchema);
