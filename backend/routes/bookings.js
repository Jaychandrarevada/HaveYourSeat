const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, seats, totalPrice } = req.body;
    
    // Generate a random ticket ID
    const ticketId = 'TKT-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const booking = new Booking({
      user: req.user.id,
      movie: movieId,
      seats,
      totalPrice,
      ticketId
    });

    await booking.save();
    
    // Populate movie details for the response
    await booking.populate('movie', 'title poster');
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating booking' });
  }
});

// Get user's bookings
router.get('/mybookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('movie', 'title poster')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

module.exports = router;
