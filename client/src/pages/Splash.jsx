import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';

export default function Splash() {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) navigate('/album', { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-dvh bg-negro flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Spotlight effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-dorado/5 rounded-full blur-[100px]" />

      {/* Diagonal stripes */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, white 40px, white 41px)' }} />

      {/* Trophy + Ball */}
      <div className="relative mb-8 z-10">
        <span className="text-8xl block" style={{ animation: 'float 3s ease-in-out infinite' }}>🏆</span>
        <span className="text-4xl absolute -bottom-1 -right-6 animate-bounce">⚽</span>
      </div>

      {/* Logo */}
      <h1 className="text-6xl text-dorado tracking-[0.15em] drop-shadow-lg z-10"
          style={{ textShadow: '0 0 40px rgba(251,191,36,0.25)' }}>
        PEGAGOL
      </h1>

      {/* Branding */}
      <p className="text-dorado/60 text-[10px] font-russo tracking-[0.4em] uppercase mt-2 z-10">
        MUNDIAL FIFA 2026
      </p>
      <p className="text-white/30 text-xs mt-2 tracking-widest z-10">
        USA &bull; MEXICO &bull; CANADA
      </p>
      <p className="text-white/20 text-xs mt-1 mb-10 z-10">
        Intercambia estampas con tus compas
      </p>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/registro')}
        className="bg-dorado hover:bg-dorado-dark text-negro font-russo text-lg
                   px-14 py-4 rounded-sm shadow-lg transform hover:scale-105
                   transition-all active:scale-95 uppercase tracking-wider z-10"
        style={{ animation: 'pulse-glow 2.5s ease-in-out infinite' }}
      >
        ENTRAR AL ALBUM
      </button>

      {/* Host flags */}
      <div className="flex gap-4 mt-10 text-2xl opacity-40 z-10">
        <span>🇺🇸</span><span>🇲🇽</span><span>🇨🇦</span>
      </div>

      <p className="text-white/10 text-[10px] mt-6 z-10">
        PANINI &bull; ESTAMPAS &bull; INTERCAMBIO
      </p>
    </div>
  );
}
