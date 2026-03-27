const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const https = require('https');

// Explicitly parse the local .env file
const envConfig = dotenv.parse(fs.readFileSync('D:/FSD/HaveYourSeat/backend/.env'));
const rawUri = envConfig.MONGODB_URI || '';
const cleanUri = rawUri.trim().replace(/^['"]|['"]$/g, '');

const moviesData = [
  { title: "F1", duration: "2h 4m", rating: "8.2/10", description: "A former Formula 1 driver comes out of retirement..." },
  { title: "Sinners", duration: "2h 15m", rating: "7.9/10", description: "Twin brothers return to their hometown..." },
  { title: "Spider-Man Brand New Day", duration: "2h 12m", rating: "8.5/10", description: "Peter Parker navigates a brand new chapter..." },
  { title: "Durandhar", duration: "2h 25m", rating: "8.0/10", description: "An epic, high-octane story centered around power, loyalty, and betrayal." },
  { title: "With Love", duration: "1h 58m", rating: "7.8/10", description: "An explosive action thriller blending passionate devotion with unrelenting vengeance." }
];

async function seed() {
  try {
    console.log("Connecting directly to Cloud URI...");
    await mongoose.connect(cleanUri);
    console.log("Connected Successfully!");
    
    // We recreate the schema definition dynamically so we don't depend on the path resolution of models
    const movieSchema = new mongoose.Schema({
        title: String,
        poster: String,
        duration: String,
        rating: String,
        releaseDate: String,
        description: String
    });
    const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

    await Movie.deleteMany({});
    
    for (let m of moviesData) {
        // Safe robust placeholders. User can override via /manage!
        m.poster = `https://placehold.co/500x750/111827/F43F5E/webp?text=${encodeURIComponent(m.title)}`;
    }

    await Movie.insertMany(moviesData);
    console.log('CLOUD Database seeded with the 5 definitive movies!');
    process.exit(0);
  } catch (err) {
    console.error('CRITICAL Seed Error:', err);
    process.exit(1);
  }
}

seed();
