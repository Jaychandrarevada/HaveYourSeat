const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const bookingRoutes = require('./routes/bookings');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);

// Intelligently clean the URI to prevent crash if the user accidentally pasted quotes or spaces in Render
const rawUri = process.env.MONGODB_URI || '';
const cleanUri = rawUri.trim().replace(/^['"]|['"]$/g, '');

if (!cleanUri) {
  console.error("CRITICAL ERROR: MONGODB_URI is totally empty or missing!");
} else {
  console.log("Attempting MongoDB Connection with scheme:", cleanUri.substring(0, 15) + "...");
}

mongoose.connect(cleanUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
