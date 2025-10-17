const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  gender: {type: String, required: true},
  residence: {type: String, required: true},
  age: {type: Number, required: true},
  phone_number: {type: String, required: true, unique: true},
  balance: {type: Number, default: 0},
  payment_history:[{
    type:mongoose.Types.ObjectId,
    ref:"Payment"
  }]
});

module.exports = mongoose.model('User', UserSchema);
