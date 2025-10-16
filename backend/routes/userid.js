const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is defined

router.get('/get-user-id', (req, res) => {
  const token = req.cookies.token; // Get token from cookies

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    res.json({ userId: decoded.id }); // Send user ID back to the client
  });
});

router.post('/get-username', async (req, res) => {
  const { username } = req.body;
  // console.log(username);

  if (!username) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await User.findById( username );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
});

module.exports = router;
