import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Ticket, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-brand-bg/60 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-brand-accent1 to-brand-accent2 p-2 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.4)] group-hover:scale-110 transition-transform">
            <Ticket size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            HaveYour<span className="text-brand-accent1">Seat</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/manage" className="text-brand-accent1 hover:text-white border border-brand-accent1/30 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm tracking-wide bg-brand-accent1/5">
            ✏️ MANAGE POSTERS
          </Link>
          {user ? (
            <>
              <Link to="/history" className="text-gray-400 hover:text-white transition-colors font-medium text-sm tracking-wide">
                MY BOOKINGS
              </Link>
              <div className="flex items-center gap-4 pl-6 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-[1px] before:bg-white/10">
                <div className="flex items-center gap-3 bg-white/5 py-1.5 px-3 rounded-full border border-white/10">
                  <div className="bg-gradient-to-r from-brand-accent1 to-brand-accent2 rounded-full p-1.5 shadow-inner">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white/90 pr-2">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-brand-accent1 hover:bg-brand-accent1/10 transition-all rounded-full"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-5">
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors font-medium text-sm tracking-wide">
                LOGIN
              </Link>
              <Link to="/register" className="btn-premium py-2 px-6 text-sm">
                SIGN UP
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
