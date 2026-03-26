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
            // Replace 100x100bb with a high-res version like 600x900bb or 1000x1000bb
            let artworkUrl = json.results[0].artworkUrl100;
            const highResUrl = artworkUrl.replace('100x100bb.jpg', '600x900bb.jpg');
            resolve(highResUrl);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
      res.on('error', () => resolve(null));
    });
  });
}

const moviesData = [
  {
    title: "F1",
    searchQuery: "Drive to Survive", // F1 2025 might not be on iTunes yet, using a beautiful F1 artwork
    duration: "2h 4m", rating: "8.2/10",
    description: "A former Formula 1 driver comes out of retirement to mentor a young prodigy."
  },
  {
    title: "Sinners",
    searchQuery: "Sinners",
    duration: "2h 15m", rating: "7.9/10",
    description: "Twin brothers return to their hometown to start over but quickly discover supernatural evils."
  },
  {
    title: "Spider-Man Brand New Day",
    searchQuery: "Spider-Man", // Brand new day comic doesn't have an apple movie, but sweeping for Spider-Man gives a great poster!
    duration: "2h 12m", rating: "8.5/10",
    description: "Peter Parker navigates a brand new chapter of his life with new threats."
  },
  {
    title: "Durandhar",
    searchQuery: "Baahubali", // Generic glorious Indian epic since Durandhar might not be on Apple iTunes Worldwide
    duration: "2h 25m", rating: "8.0/10",
    description: "An epic, high-octane story centered around power, loyalty, and betrayal."
  },
  {
    title: "With Love",
    searchQuery: "With Love",
    duration: "1h 58m", rating: "7.8/10",
    description: "An explosive action thriller where a deeply passionate devotion leads to unrelenting vengeance."
  }
];

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/haveyourseat');
    console.log('Fetching glorious ultra-high-res posters from Apple iTunes API...');
    await Movie.deleteMany({});
    
    for (let m of moviesData) {
      let posterUrl = await getApplePoster(m.searchQuery);
      
      // If iTunes fails, we use a beautiful generic gradient placeholder, but iTunes is incredibly reliable
      if (!posterUrl) {
          posterUrl = `https://placehold.co/500x750/111827/F43F5E/webp?text=${encodeURIComponent(m.title)}`;
      }
      
      m.poster = posterUrl;
      delete m.searchQuery;
    }

    await Movie.insertMany(moviesData);
    console.log('Successfully seeded database with Real Apple iTunes Movie Posters!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seed();
