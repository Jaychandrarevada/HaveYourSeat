import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center animate-fade-in py-12 px-4 relative">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-accent3/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      
      <div className="glass-panel p-10 sm:p-14 w-full max-w-lg relative z-10 border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black mb-3 text-white">Welcome Back</h2>
          <p className="text-white/50 font-medium">Enter your details to access your account</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-8 text-sm flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-accent1 to-brand-accent2 rounded-xl opacity-0 group-focus-within:opacity-100 blur-[2px] transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-white/40 group-focus-within:text-brand-accent2 transition-colors" size={20} />
                <input 
                  type="email" 
                  className="w-full bg-[#111] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:bg-[#1a1a1a] transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Password</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-accent1 to-brand-accent2 rounded-xl opacity-0 group-focus-within:opacity-100 blur-[2px] transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-white/40 group-focus-within:text-brand-accent2 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full bg-[#111] border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-white/20 focus:outline-none focus:bg-[#1a1a1a] transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-premium w-full mt-10 text-lg flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In securely'}
          </button>
        </form>

        <p className="text-center mt-8 text-white/40">
          New to HaveYourSeat?{' '}
          <Link to="/register" className="text-white font-bold hover:text-brand-accent2 transition-colors underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
