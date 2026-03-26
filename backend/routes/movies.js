const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

// Default Seed Logic (Removed specific Amazon urls so its generic)

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching movies' });
  }
});

// Get single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching movie' });
  }
});

// Seed movies helper (only for development/testing)
router.post('/seed', async (req, res) => {
  try {
    const sampleMovies = [
      {
        title: "Dune: Part Two",
        poster: "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_Part_Two_poster.jpg",
        duration: "2h 46m",
        rating: "8.8/10",
        description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family."
      },
      {
        title: "Oppenheimer",
        poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODktNzc2NDRjZjhiM2EzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        duration: "3h",
        rating: "8.5/10",
        description: "The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb."
      },
      {
        title: "Spider-Man: Across the Spider-Verse",
        poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        duration: "2h 20m",
        rating: "8.7/10",
        description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence."
      },
      {
        title: "Avatar: The Way of Water",
        poster: "https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg",
        duration: "3h 12m",
        rating: "7.7/10",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora."
      }
    ];
    await Movie.deleteMany({});
    await Movie.insertMany(sampleMovies);
    res.status(201).json({ message: 'Movies seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error seeding movies' });
  }
});

// Unrestricted Poster Edit Route for User to quickly manage URLs
router.put('/:id', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, { poster: req.body.poster }, { new: true });
    if (!updatedMovie) return res.status(404).json({ message: "Movie not found" });
    res.json(updatedMovie);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update poster', error: err.message });
  }
});

module.exports = router;
