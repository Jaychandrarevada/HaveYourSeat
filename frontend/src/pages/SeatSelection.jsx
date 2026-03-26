import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowRight } from 'lucide-react';

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Fake booked seats for simulation
  const bookedSeats = ['B3', 'C4', 'A1'];
  
  const rows = ['A', 'B', 'C', 'D'];
  const cols = [1, 2, 3, 4, 5];
  const seatPrice = 150;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.warn('Backend unavailable, using static movie details for SeatSelection:', err);
        const mockMovies = {
          'mock1': { _id: 'mock1', title: "Dune: Part Two", poster: "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_Part_Two_poster.jpg", duration: "2h 46m", rating: "8.8/10", description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family." },
          'mock2': { _id: 'mock2', title: "Oppenheimer", poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODktNzc2NDRjZjhiM2EzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", duration: "3h", rating: "8.5/10", description: "The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb." },
          'mock3': { _id: 'mock3', title: "Spider-Man: Across the Spider-Verse", poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", duration: "2h 20m", rating: "8.7/10", description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence." },
          'mock4': { _id: 'mock4', title: "Avatar: The Way of Water", poster: "https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg", duration: "3h 12m", rating: "7.7/10", description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora." }
        };
        setMovie(mockMovies[id] || mockMovies['mock1']);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    );
  };

  const proceedToPayment = () => {
    navigate('/payment', {
      state: {
        movieId: movie._id,
        movieTitle: movie.title,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * seatPrice
      }
    });
  };

  if (loading || !movie) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-brand-accent h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pt-8 pb-32">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black mb-3 tracking-tight">{movie.title}</h1>
        <p className="text-brand-accent2 font-medium tracking-widest uppercase text-sm">Select your prime seats</p>
      </div>

      <div className="glass-panel p-8 md:p-14 mb-8 bg-brand-bg/40">
        {/* Premium Screen */}
        <div className="w-full max-w-2xl mx-auto mb-20 relative perspective-1000">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-brand-accent2 opacity-20 blur-[50px] pointer-events-none"></div>
          <div className="h-3 w-full bg-gradient-to-r from-gray-800 via-white/80 to-gray-800 rounded-full shadow-[0_15px_50px_rgba(255,255,255,0.15)] transform rotate-X-12"></div>
          <div className="text-center text-xs text-white/40 mt-6 tracking-[0.5em] uppercase font-bold">Screen This Way</div>
        </div>

        {/* Seat Grid */}
        <div className="flex flex-col items-center gap-5 map">
          {rows.map(row => (
            <div key={row} className="flex items-center gap-6">
              <span className="w-6 text-center font-bold text-white/30">{row}</span>
              <div className="flex gap-4 sm:gap-5">
                {cols.map(col => {
                  const seatId = `${row}${col}`;
                  const isBooked = bookedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  
                  return (
                    <button
                      key={seatId}
                      disabled={isBooked}
                      onClick={() => toggleSeat(seatId)}
                      className={`
                        seat-3d w-10 h-10 sm:w-12 sm:h-12 rounded-t-2xl rounded-b-md transition-all duration-300 relative overflow-hidden group
                        ${isBooked ? 'bg-[#1a1a1a] cursor-not-allowed border border-white/5 opacity-50' : 
                          isSelected ? 'bg-gradient-to-br from-brand-accent1 to-brand-accent2 shadow-[0_0_20px_rgba(244,63,94,0.6)] transform -translate-y-2 border border-white/20' : 
                          'bg-white/10 hover:bg-white/20 border border-white/10 hover:-translate-y-1 hover:shadow-lg'}
                      `}
                      title={seatId}
                    >
                      <span className={`text-[10px] sm:text-xs font-bold ${isSelected ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>{col}</span>
                      {isSelected && <div className="absolute inset-0 bg-white/20 animate-pulse-glow rounded-t-2xl rounded-b-md"></div>}
                    </button>
                  );
                })}
              </div>
              <span className="w-6 text-center font-bold text-white/30">{row}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-10 mt-16 pt-10 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="seat-3d w-6 h-6 rounded-t-lg bg-white/10 border border-white/10"></div>
            <span className="text-sm font-medium text-white/60">Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="seat-3d w-6 h-6 rounded-t-lg bg-gradient-to-br from-brand-accent1 to-brand-accent2"></div>
            <span className="text-sm font-medium text-white/60">Selected</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="seat-3d w-6 h-6 rounded-t-lg bg-[#1a1a1a] border border-white/5 opacity-50"></div>
            <span className="text-sm font-medium text-white/60">Booked</span>
          </div>
        </div>
      </div>

      {/* Premium Summary Bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-6 animate-slide-up pointer-events-none">
          <div className="max-w-4xl mx-auto glass-panel p-5 px-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-brand-accent1/20 pointer-events-auto">
            <div className="flex-1">
              <p className="text-xs text-brand-accent2 font-bold uppercase tracking-wider mb-1">Selected Seats ({selectedSeats.length})</p>
              <p className="font-black text-xl text-white tracking-wide">{selectedSeats.join(', ')}</p>
            </div>
            <div className="sm:text-right flex-1 border-l border-white/10 pl-6 sm:border-none sm:pl-0">
              <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1">Total Amount</p>
              <p className="font-black text-3xl text-gradient">₹{selectedSeats.length * seatPrice}</p>
            </div>
            <button 
              onClick={proceedToPayment}
              className="btn-premium w-full sm:w-auto flex items-center justify-center gap-3 shrink-0 py-4"
            >
              <span>Continue Booking</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
