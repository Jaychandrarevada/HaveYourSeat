import { useLocation, Link, Navigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { CheckCircle, Download, Calendar, MapPin, Clock, Loader2 } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function Success() {
  const location = useLocation();
  const ticket = location.state?.ticket;
  
  const ticketRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    try {
      await new Promise(r => setTimeout(r, 150)); // tiny delay for DOM paints
      const dataUrl = await toPng(ticketRef.current, {
        backgroundColor: '#0a0a0a',
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `HaveYourSeat-Ticket-${ticket.ticketId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download ticket', err);
      alert('Failed to prepare ticket image.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!ticket) return <Navigate to="/" replace />;

  return (
    <div className="min-h-[85vh] flex items-center justify-center animate-fade-in py-12 px-4 relative">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent3/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      
      <div className="max-w-md w-full relative z-10 animate-slide-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white mb-6 shadow-[0_0_50px_rgba(74,222,128,0.4)] relative">
            <CheckCircle size={48} />
            <div className="absolute inset-0 rounded-full border-4 border-white/20 scale-110 animate-pulse-glow"></div>
          </div>
          <h1 className="text-4xl font-black mb-3 text-white">Payment Successful</h1>
          <p className="text-white/60 font-medium tracking-wide">Your seats have been securely reserved.</p>
        </div>

        {/* Premium Ticket Card Wrapper */}
        <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] text-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 relative transform hover:scale-[1.02] transition-transform duration-500">
          
          {/* Exportable Area */}
          <div ref={ticketRef} className="relative rounded-[2rem] overflow-hidden bg-gradient-to-b from-[#111] to-[#0a0a0a]">
            {/* Ticket Edge Cutouts */}
            <div className="absolute top-[55%] -ml-6 -mt-6 w-12 h-12 bg-brand-bg rounded-full shadow-[inset_-5px_0_10px_rgba(0,0,0,0.5)] border-r border-white/5 z-20"></div>
            <div className="absolute top-[55%] right-0 -mr-6 -mt-6 w-12 h-12 bg-brand-bg rounded-full shadow-[inset_5px_0_10px_rgba(0,0,0,0.5)] border-l border-white/5 z-20"></div>
            
            <div className="p-8 sm:p-10 relative border-b-2 border-dashed border-white/10 pb-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] uppercase font-bold text-brand-accent2 tracking-[0.2em] mb-2">Movie Title</p>
                  <h2 className="text-2xl sm:text-3xl font-black leading-tight text-gradient">{ticket.movie?.title || 'Unknown Movie'}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.1em] mb-2 flex items-center gap-1.5"><MapPin size={12}/> Theatre</p>
                  <p className="font-bold text-white/90">{ticket.theatreName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.1em] mb-2 flex items-center justify-end gap-1.5"><Calendar size={12}/> Date</p>
                  <p className="font-bold text-white/90">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.1em] mb-2 flex items-center gap-1.5"><Clock size={12}/> Time</p>
                  <p className="font-bold text-white/90">{ticket.showTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.1em] mb-2">Seats</p>
                  <p className="font-black text-xl text-brand-accent1">{ticket.seats.join(', ')}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 sm:p-10 pt-12 text-center bg-gradient-to-t from-white/5 to-transparent relative">
              <p className="text-[10px] uppercase font-bold text-white/30 tracking-[0.2em] mb-4">Ticket ID</p>
              <p className="font-mono font-bold text-xl text-white/80 tracking-widest mb-6">{ticket.ticketId}</p>

              {/* Premium Barcode Effect */}
              <div className="flex justify-center mb-8 h-16 opacity-70">
                 <div className="h-full w-1.5 bg-white rounded-full mr-1"></div>
                 <div className="h-full w-3 bg-white rounded-full mr-1.5"></div>
                 <div className="h-full w-1 bg-white rounded-full mr-2"></div>
                 <div className="h-full w-4 bg-white rounded-full mr-1.5 bg-gradient-to-b from-brand-accent1 to-brand-accent2"></div>
                 <div className="h-full w-1.5 bg-white rounded-full mr-1"></div>
                 <div className="h-full w-2 bg-white rounded-full mr-2"></div>
                 <div className="h-full w-5 bg-white rounded-full mr-1"></div>
                 <div className="h-full w-1 bg-white rounded-full mr-1"></div>
                 <div className="h-full w-2 bg-white rounded-full mr-2 text-brand-accent1"></div>
                 <div className="h-full w-1.5 bg-white rounded-full mr-1.5"></div>
                 <div className="h-full w-4 bg-white rounded-full mr-1"></div>
                 <div className="h-full w-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Download Button Area (Outside Capture Zone) */}
          <div className="px-8 sm:px-10 pb-8 text-center relative z-20 -mt-4 bg-[#0a0a0a] rounded-b-[2rem]">
            <button 
              onClick={downloadTicket}
              disabled={isDownloading}
              className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors border border-white/5 flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <><Loader2 size={18} className="animate-spin text-brand-accent2"/> Generating...</>
              ) : (
                <><Download size={18} className="text-brand-accent2" /> Download E-Ticket</>
              )}
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-medium border-b border-transparent hover:border-white pb-1">
            Return to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
