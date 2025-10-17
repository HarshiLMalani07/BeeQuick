const Razorpay = require('razorpay');
const express = require('express');
const Payment = require('../models/Payment');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

router.post('/createOrder', async (req, res) => {
  const {amount} = req.body;
  const options = {
    amount: amount, // amount in the smallest currency unit
    currency: 'INR',
    receipt: 'receipt#1',
  };
  try {
    const order = await instance.orders.create(options);
    return res.json(order);
  } catch (error) {
    return res.status(500).send(error);
  }
});
router.post('/savePayment', async (req, res) => {
  try {
    const {user_id, payment_id, payment_amount} = req.body;

    const newPayment = new Payment({
      user_id,
      payment_id,
      payment_amount,
    });
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      console.log('user id is not valid');
    }
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    user.payment_history = [...user.payment_history, newPayment];
    user.balance = payment_amount;
    await user.save();
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

router.post('/getPayment', async (req, res) => {
  try {
    const {userId} = req.body;
    if (!userId) {
      return res.status(400).json({message: 'User id is required'});
    }
    const user = await User.findById(userId).populate('payment_history');
    return res.status(200).json(user.payment_history);
  } catch (error) {
    return res.status(500).json({message: 'Internal Server Error'});
  }
});
module.exports = router;
