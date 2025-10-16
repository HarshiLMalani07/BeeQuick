const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bicycle', required: true },
  loc_pick: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  loc_drop: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }, // Not required initially
  time_pick: { type: Date, required: true },
  time_drop: { type: Date }, // Not required initially
  amount: { type: Number }, // Not required initially
});

module.exports = mongoose.model('Ride', RideSchema);
