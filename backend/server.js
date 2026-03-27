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
  .then(async () => {
    console.log('Connected to MongoDB! Checking for empty DB...');
    const Movie = require('./models/Movie');
    const count = await Movie.countDocuments();
    if (count === 0) {
        console.log("Database is completely empty! Automatically seeding movies...");
        const moviesData = [
          { title: "F1", duration: "2h 4m", rating: "8.2/10", description: "Formula 1 action", poster: "https://placehold.co/500x750/000000/F43F5E/webp?text=F1" },
          { title: "Sinners", duration: "2h 15m", rating: "7.9/10", description: "Vampire action directed by Ryan Coogler", poster: "https://placehold.co/500x750/000000/F43F5E/webp?text=Sinners" },
          { title: "Spider-Man Brand New Day", duration: "2h 12m", rating: "8.5/10", description: "Peter Parker navigates a brand new chapter", poster: "https://placehold.co/500x750/000000/F43F5E/webp?text=Spider-Man" },
          { title: "Dhurandhar", duration: "2h 25m", rating: "8.0/10", description: "An epic high-octane story", poster: "https://placehold.co/500x750/000000/F43F5E/webp?text=Dhurandhar" },
          { title: "With Love", duration: "1h 58m", rating: "7.8/10", description: "Explosive action thriller", poster: "https://placehold.co/500x750/000000/F43F5E/webp?text=With+Love" }
        ];
        await Movie.insertMany(moviesData);
        console.log("Seeding Complete!");
    }
    
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
