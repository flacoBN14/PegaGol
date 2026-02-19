import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';
import TeamBadge from '../components/TeamBadge';

export default function Splash() {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) navigate('/album', { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-dvh bg-negro flex flex-col items-center justify-center px-8 text-center relative overflow-hidden">
      {/* Geometric background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[1px] h-full bg-white/[0.04] transform rotate-12 origin-top-right" />
        <div className="absolute top-0 left-[30%] w-[1px] h-full bg-white/[0.03] transform -rotate-6" />
        <div className="absolute inset-0 opacity-[0.015]"
             style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Three Stripes Brand Mark */}
      <div className="relative z-10 mb-10">
        <div className="flex flex-col items-center gap-[3px] mb-8">
          <div className="w-10 h-[4px] bg-[#00c853]" />
          <div className="w-8 h-[4px] bg-[#2196f3]" />
          <div className="w-6 h-[4px] bg-[#f44336]" />
        </div>

        {/* Logo - Editorial Bold */}
        <h1 className="logo-editorial text-[72px] text-white leading-[0.85] tracking-[0.08em]">
          PEGA
        </h1>
        <h1 className="logo-editorial text-[72px] text-white leading-[0.85] tracking-[0.08em] -mt-1">
          GOL
        </h1>

        <div className="w-12 h-[2px] bg-white/30 mx-auto mt-4 mb-3" />

        <p className="text-[10px] text-white/25 tracking-[0.5em] uppercase font-medium">
          WORLD CUP 2026
        </p>
      </div>

      {/* Host countries */}
      <div className="flex items-center gap-4 z-10 mb-3">
        <TeamBadge team="Estados Unidos" size="md" />
        <div className="w-[1px] h-4 bg-white/10" />
        <TeamBadge team="Mexico" size="md" />
        <div className="w-[1px] h-4 bg-white/10" />
        <TeamBadge team="Canada" size="md" />
      </div>

      <p className="text-white/15 text-[9px] tracking-[0.3em] mb-12 z-10 uppercase">
        USA &middot; MEX &middot; CAN
      </p>

      {/* CTA Button */}
      <button
        onClick={() => navigate('/registro')}
        className="btn-primary z-10 w-full max-w-[280px]"
      >
        ENTRAR
      </button>

      <p className="text-white/10 text-[8px] mt-8 z-10 tracking-[0.3em] uppercase">
        ALBUM DIGITAL DE ESTAMPAS
      </p>
    </div>
  );
}
