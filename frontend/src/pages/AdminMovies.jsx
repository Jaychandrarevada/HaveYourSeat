import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Save, X, AlertCircle } from 'lucide-react';

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [posterUrl, setPosterUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/movies');
      setMovies(res.data);
    } catch (err) {
      setError('Failed to fetch movies.');
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setPosterUrl(movie.poster);
    setError(null);
  };

  const handleSave = async (id) => {
    try {
      if (!posterUrl) return setError("Poster URL cannot be empty");
      await axios.put((import.meta.env.VITE_API_URL || "http://localhost:5000") + `/api/movies/${id}`, { poster: posterUrl });
      setEditingMovie(null);
      fetchMovies();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update movie poster');
    }
  };

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Manage Posters</h1>
        <p className="text-gray-400">Paste your custom Google Image URLs below to instantly update the movie posters on the main page.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map(movie => (
          <div key={movie._id} className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex gap-4">
              <img src={movie.poster} alt={movie.title} className="w-20 h-28 object-cover rounded-lg shadow-lg border border-white/10 bg-black" />
              <div>
                <h3 className="text-xl font-bold text-white">{movie.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{movie.duration} • {movie.rating}</p>
              </div>
            </div>
            
            {editingMovie && editingMovie._id === movie._id ? (
              <div className="flex flex-col gap-3 mt-2">
                <input 
                  type="url"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="Paste direct .jpg link here..."
                  className="w-full bg-black/40 border border-brand-accent1/50 rounded-xl px-4 py-2 text-white outline-none focus:border-brand-accent1 transition-colors"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSave(movie._id)}
                    className="flex-1 bg-brand-accent1 hover:bg-brand-accent2 text-white py-2 rounded-xl transition-colors font-bold flex justify-center items-center gap-2"
                  >
                    <Save size={16} /> Save
                  </button>
                  <button 
                    onClick={() => setEditingMovie(null)}
                    className="p-2 border border-white/20 hover:bg-white/10 text-white rounded-xl transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => handleEdit(movie)}
                className="w-full mt-2 py-2 border border-brand-accent1/30 text-brand-accent1 hover:bg-brand-accent1/10 rounded-xl transition-colors font-semibold flex justify-center items-center gap-2"
              >
                <Edit2 size={16} /> Edit Poster URL
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
