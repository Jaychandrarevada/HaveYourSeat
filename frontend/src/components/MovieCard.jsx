import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie._id}`} className="group relative block overflow-hidden rounded-2xl bg-brand-bg border border-white/5 shadow-xl hover:shadow-[0_0_40px_-10px_rgba(244,63,94,0.4)] transition-all duration-500 hover:-translate-y-3">
      <div className="aspect-[2/3] w-full relative overflow-hidden">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Dark overlay that fades out slightly on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 z-10">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-brand-accent1 transition-colors">{movie.title}</h3>
        <div className="flex items-center gap-4 text-sm font-medium text-white/70">
          <div className="flex items-center gap-1.5 bg-brand-bg/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10 shadow-lg">
            <Star size={14} className="text-yellow-400 fill-yellow-400 group-hover:animate-pulse-glow" />
            <span>{movie.rating}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-brand-bg/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10 shadow-lg">
            <Clock size={14} className="text-brand-accent2" />
            <span>{movie.duration}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
