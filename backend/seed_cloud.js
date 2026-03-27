require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const https = require('https');

async function getApplePoster(title) {
  return new Promise((resolve) => {
    https.get(`https://itunes.apple.com/search?term=${encodeURIComponent(title)}&entity=movie&limit=1`, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.results && json.results.length > 0) {
            let artworkUrl = json.results[0].artworkUrl100;
            const highResUrl = artworkUrl.replace('100x100bb.jpg', '600x900bb.jpg');
            resolve(highResUrl);
          } else resolve(null);
        } catch (e) { resolve(null); }
      });
      res.on('error', () => resolve(null));
    });
  });
}

const moviesData = [
  { title: "F1", searchQuery: "Drive to Survive", duration: "2h 4m", rating: "8.2/10", description: "A former Formula 1 driver comes out of retirement..." },
  { title: "Sinners", searchQuery: "Sinners", duration: "2h 15m", rating: "7.9/10", description: "Twin brothers return to their hometown..." },
  { title: "Spider-Man Brand New Day", searchQuery: "Spider-Man", duration: "2h 12m", rating: "8.5/10", description: "Peter Parker navigates a brand new chapter..." },
  { title: "Durandhar", searchQuery: "Baahubali", duration: "2h 25m", rating: "8.0/10", description: "An epic, high-octane story centered around power, loyalty, and betrayal." },
  { title: "With Love", searchQuery: "With Love", duration: "1h 58m", rating: "7.8/10", description: "An explosive action thriller where a deeply passionate devotion leads to unrelenting vengeance." }
];

async function seedCloud() {
  try {
    const rawUri = process.env.MONGODB_URI || '';
    const cleanUri = rawUri.trim().replace(/^['"]|['"]$/g, '');
    
    if (!cleanUri) throw new Error("No MONGODB_URI found in local .env!");

    console.log("Connecting to Cloud DB to push movies...");
    await mongoose.connect(cleanUri);
    console.log("Connected Successfully!");
    
    await Movie.deleteMany({});
    
    for (let m of moviesData) {
      let posterUrl = await getApplePoster(m.searchQuery);
      if (!posterUrl) posterUrl = `https://placehold.co/500x750/111827/F43F5E/webp?text=${encodeURIComponent(m.title)}`;
      m.poster = posterUrl;
      delete m.searchQuery;
    }

    await Movie.insertMany(moviesData);
    console.log('Successfully seeded CLOUD Database with Official Movies!');
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
}

seedCloud();
