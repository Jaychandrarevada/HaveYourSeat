import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/movies');
        setMovies(res.data);
      } catch (err) {
        console.warn('Backend unavailable, using static movies for simulation:', err);
        setMovies([
          {
            _id: 'mock1',
            title: "Dune: Part Two",
            poster: "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_Part_Two_poster.jpg",
            duration: "2h 46m",
            rating: "8.8/10",
            description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family."
          },
          {
            _id: 'mock2',
            title: "Oppenheimer",
            poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODktNzc2NDRjZjhiM2EzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            duration: "3h",
            rating: "8.5/10",
            description: "The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb."
          },
          {
            _id: 'mock3',
            title: "Spider-Man: Across the Spider-Verse",
            poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
            duration: "2h 20m",
            rating: "8.7/10",
            description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence."
          },
          {
            _id: 'mock4',
            title: "Avatar: The Way of Water",
            poster: "https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg",
            duration: "3h 12m",
            rating: "7.7/10",
            description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-brand-accent h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in pt-24 pb-12">
      <div className="mb-14 text-center sm:text-left flex flex-col md:flex-row justify-between items-end gap-6 relative">
        {/* Ambient glow behind heading */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-accent1 opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 w-full text-center sm:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tighter">
            Now <span className="text-gradient">Showing</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto sm:mx-0">
            Book tickets for the most anticipated cinematic experiences.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
        {movies.map((movie, index) => (
          <div key={movie._id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}
