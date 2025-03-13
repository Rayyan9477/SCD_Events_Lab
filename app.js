const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Route files
// const authRoutes = require('./routes/auth');
// const categoryRoutes = require('./routes/categories');
// const eventRoutes = require('./routes/events');
// const reminderRoutes = require('./routes/reminders');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
// app.use('/api/auth', authRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/reminders', reminderRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Event Planner API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

module.exports = app;