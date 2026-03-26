const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const https = require('https');

async function getPoster(query) {
  return new Promise((resolve) => {
    https.get('https://www.themoviedb.org/search?query=' + encodeURIComponent(query), {headers:{'User-Agent':'Mozilla/5.0'}}, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        const match = body.match(/<img loading="lazy" class="poster" src="(\/t\/p\/w94_and_h141_bestv2\/.*?\.jpg)"/);
        if(match) resolve('https://image.tmdb.org' + match[1].replace('w94_and_h141_bestv2', 'w500'));
        else resolve('https://placehold.co/500x750/000000/F43F5E/webp?text=' + encodeURIComponent(query));
      });
      res.on('error', () => resolve('https://placehold.co/500x750/000000/F43F5E/webp?text=' + encodeURIComponent(query)));
    });
  });
}

async function fixDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/haveyourseat');
    console.log('Scraping exactly matching posters from TMDB...');
    await Movie.deleteMany({});
    
    const movies = [
      {
        title: "F1",
        duration: "2h 4m",
        rating: "8.2/10",
        description: "A former Formula 1 driver comes out of retirement to mentor a young prodigy and take his final shot at glory on the track."
      },
      {
        title: "Sinners",
        duration: "2h 15m",
        rating: "7.9/10",
        description: "Twin brothers return to their hometown to start over but quickly discover that the supernatural evils of the area are deeply rooted."
      },
      {
        title: "Spider-Man: Brand New Day",
        duration: "2h 12m",
        rating: "8.5/10",
        description: "Peter Parker navigates a brand new chapter of his life in New York City with new threats and challenges."
      },
      {
        title: "Dhurandhar",
        duration: "2h 25m",
        rating: "8.0/10",
        description: "An epic, high-octane story centered around power, loyalty, and betrayal."
      },
      {
        title: "With Love",
        duration: "1h 58m",
        rating: "7.8/10",
        description: "An explosive action thriller where a deeply passionate devotion leads to unrelenting vengeance."
      }
    ];

    for(let m of movies) {
      m.poster = await getPoster(m.title);
    }

    await Movie.insertMany(movies);
    console.log('5 Movies injected successfully with real posters.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDB();
