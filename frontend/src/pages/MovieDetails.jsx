import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Clock, Ticket, Loader2 } from 'lucide-react';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.warn('Backend unavailable, using static movie details:', err);
        const mockMovies = {
          'mock1': {
            _id: 'mock1', title: "Dune: Part Two", poster: "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_Part_Two_poster.jpg", duration: "2h 46m", rating: "8.8/10", description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family."
          },
          'mock2': {
            _id: 'mock2', title: "Oppenheimer", poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODktNzc2NDRjZjhiM2EzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", duration: "3h", rating: "8.5/10", description: "The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb."
          },
          'mock3': {
            _id: 'mock3', title: "Spider-Man: Across the Spider-Verse", poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", duration: "2h 20m", rating: "8.7/10", description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence."
          },
          'mock4': {
            _id: 'mock4', title: "Avatar: The Way of Water", poster: "https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg", duration: "3h 12m", rating: "7.7/10", description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora."
          }
        };
        setMovie(mockMovies[id] || mockMovies['mock1']);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-brand-accent h-12 w-12" />
      </div>
    );
  }

  if (!movie) return <div className="text-center mt-20 text-xl">Movie not found</div>;

  return (
    <div className="animate-fade-in relative min-h-screen -mt-4 pt-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {/* Immersive Blurred Background */}
      <div
        className="absolute inset-0 z-0 opacity-20 blur-[100px] scale-110 pointer-events-none transition-all duration-1000"
        style={{ backgroundImage: `url(${movie.poster})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
      ></div>

      <div className="relative z-10 max-w-5xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row glass-panel overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="md:w-2/5 w-full shrink-0 relative overflow-hidden group">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-transparent to-transparent opacity-60"></div>
          </div>

          <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center bg-brand-bg/40 backdrop-blur-md w-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-white/80 mb-8">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm shadow-inner">
                <Star className="text-yellow-400 fill-yellow-400" size={18} />
                <span className="font-bold tracking-wide">{movie.rating}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm shadow-inner">
                <Clock size={18} className="text-brand-accent2" />
                <span className="font-bold tracking-wide">{movie.duration}</span>
              </div>
            </div>

            <p className="text-lg text-white/70 mb-12 leading-relaxed font-medium">
              {movie.description}
            </p>

            <button
              onClick={() => navigate(`/movie/${movie._id}/seats`)}
              className="btn-premium w-full sm:w-auto text-lg py-4 px-10 flex items-center justify-center gap-3 mt-auto"
            >
              <Ticket className="group-hover:rotate-12 transition-transform" />
              <span>Book Tickets Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
