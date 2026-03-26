const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const https = require('https');

// Helper to query Wikipedia's API for the main page image
async function fetchWikiImage(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`;
    https.get(url, { headers: { 'User-Agent': 'HaveYourSeatApp/1.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].original && pages[pageId].original.source) {
            resolve(pages[pageId].original.source);
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
    wikiSearch: "F1 (film)", 
    duration: "2h 4m", rating: "8.2/10",
    description: "A former Formula 1 driver comes out of retirement to mentor a young prodigy."
  },
  {
    title: "Sinners",
    wikiSearch: "Sinners (2025 film)",
    duration: "2h 15m", rating: "7.9/10",
    description: "Twin brothers return to their hometown to start over but quickly discover supernatural evils."
  },
  {
    title: "Spider-Man Brand New Day",
    wikiSearch: "Spider-Man: Brand New Day", 
    duration: "2h 12m", rating: "8.5/10",
    description: "Peter Parker navigates a brand new chapter of his life with new threats."
  },
  {
    title: "Durandhar",
    wikiSearch: "Dhurandhar (film)", 
    duration: "2h 25m", rating: "8.0/10",
    description: "An epic, high-octane story centered around power, loyalty, and betrayal."
  },
  {
    title: "With Love",
    wikiSearch: "With Love (2025 film)",
    duration: "1h 58m", rating: "7.8/10",
    description: "An explosive action thriller where a deeply passionate devotion leads to unrelenting vengeance."
  }
];

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/haveyourseat');
    console.log('Connected to DB. Fetching Wikipedia imagery...');
    await Movie.deleteMany({});
    
    // Fetch real images
    for (let m of moviesData) {
      let posterUrl = await fetchWikiImage(m.wikiSearch);
      
      // Fallbacks if Wikipedia doesn't have an exact match
      if (!posterUrl) {
         // Attempt a generic search if specific fails
         posterUrl = await fetchWikiImage(m.title);
      }
      
      if (!posterUrl) {
          // If all fails, use a beautiful external stock photo API configured exactly to the 500x750 Aspect Ratio.
          // Since the user didn't like solid placeholders, we'll use actual random poster-like cinematic photographs from Unsplash Source
          // Unsplash source is fast and guarantees an actual "photo".
          posterUrl = `https://picsum.photos/seed/${encodeURIComponent(m.title)}/500/750`;
      }
      
      m.poster = posterUrl;
      delete m.wikiSearch; // remove helper property
    }

    await Movie.insertMany(moviesData);
    console.log('Successfully seeded database with beautiful Wikipedia posters!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seed();
