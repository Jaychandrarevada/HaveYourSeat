import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Ticket as TicketIcon, Calendar, ArrowRight } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

export default function History() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/mybookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-brand-accent h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pt-12 pb-24 px-4 sm:px-0 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent3/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      <div className="mb-12 relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-accent1 to-brand-accent3 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          <TicketIcon className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight">Booking History</h1>
          <p className="text-white/50 font-medium">Your cinematic journey so far</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-panel text-center py-24 px-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-accent1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-700 blur-[1px]">
             <TicketIcon size={40} className="text-white/20" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No bookings yet</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">You haven't booked any movies yet. Explore our collection and find your next favorite film.</p>
          <Link to="/" className="btn-premium inline-block">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          {bookings.map((booking, index) => (
            <div 
              key={booking._id} 
              className="glass-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-accent1 to-brand-accent2 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-xl"></div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent3 bg-brand-accent3/10 px-2 py-1 rounded">Confirmed</span>
                  <p className="text-xs text-white/40 font-mono tracking-widest">ID: {booking.ticketId}</p>
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-brand-accent1 transition-colors">{booking.movie?.title || 'Unknown Movie'}</h3>
                
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-white/70 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-white/40" />
                    <span>{new Date(booking.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TicketIcon size={16} className="text-white/40" />
                    <span className="text-white font-bold">{booking.seats.join(', ')} <span className="text-white/40 font-normal">({booking.seats.length} seats)</span></span>
                  </div>
                </div>
              </div>
              
              <div className="md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 flex flex-row md:flex-col justify-between items-center md:items-end">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Total Paid</p>
                  <p className="text-3xl font-black text-gradient">₹{booking.totalPrice}</p>
                </div>
                <button 
                  onClick={() => navigate('/success', { state: { ticket: booking } })}
                  className="text-white/50 hover:text-brand-accent2 font-bold text-sm tracking-wide transition-colors mt-0 md:mt-6 flex items-center gap-2"
                >
                  View Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
