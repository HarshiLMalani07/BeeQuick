const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const useridRoutes = require('./routes/userid');
const bicycleRoutes = require('./routes/bicycles');
const locationRoutes = require('./routes/locations');
const rideRoutes = require('./routes/rides');
const {verifyToken} = require('./middlewares/auth'); // Middleware for JWT verification
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const createOrder = require('./routes/createOrder');

// Connect to the database
connectDB();

app.use(cookieParser());
// Middleware for parsing JSON
app.use(express.json());
app.use(bodyParser.json());
// Cookie-Parser
app.use(cookieParser());

// Middleware for parsing URL-encoded form data
app.use(express.urlencoded({extended: true}));

app.use(cors());
// Middleware to set response headers for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/userid', useridRoutes);
app.use('/api/bicycles', verifyToken, bicycleRoutes); // Protecting routes with verifyToken
app.use('/api/locations', verifyToken, locationRoutes);
app.use('/api/rides', verifyToken, rideRoutes);
app.get('/api/getkey', (req, res) =>
  res.status(200).json({key: process.env.RAZORPAY_API_KEY}),
);
app.use('/api/payment', verifyToken, createOrder);
// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_API_KEY,
//   key_secret: process.env.RAZORPAY_APT_SECRET,
// });
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({message: 'Server Error'});
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
