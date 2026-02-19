import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { registerUser } from '../lib/api';

const SALONES = ['5-A', '5-B', '5-C', '6-A', '6-B', '6-C'];

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [salon, setSalon] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);
  const [exiting, setExiting] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !salon) return;
    setLoading(true);
    try {
      const user = await registerUser(nombre.trim(), salon);
      login(user);
      // Trigger exit animation
      setExiting(true);
      setTimeout(() => navigate('/album', { replace: true }), 600);
    } catch {
      alert('Error al registrarse. Intenta de nuevo.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      const users = await getUsers();
      setDemoUsers(users);
      setShowDemo(true);
    } catch {
      alert('Error al cargar usuarios de prueba');
    }
  };

  const loginAsDemo = (user) => {
    login(user);
    setExiting(true);
    setTimeout(() => navigate('/album', { replace: true }), 600);
  };

  return (
    <div className={`min-h-dvh bg-negro flex flex-col relative overflow-hidden transition-all duration-500
      ${exiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
      {/* Background - Editorial B&W football imagery */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"
          alt=""
          className="w-full h-full object-cover opacity-[0.07] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-negro via-negro/90 to-negro/50" />
      </div>

      {/* Geometric lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-[20%] w-[1px] h-full bg-white/[0.03]" />
        <div className="absolute top-0 right-[25%] w-[1px] h-full bg-white/[0.02]" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-sm">
          {/* Logo header - entrance animation */}
          <div className="text-center mb-10 animate-slide-up">
            <div className="flex flex-col items-center gap-[2px] mb-4"
                 style={{ animation: 'fade-in 0.8s ease-out 0.2s both' }}>
              <div className="w-7 h-[3px] bg-[#00c853]" />
              <div className="w-5.5 h-[3px] bg-[#2196f3]" />
              <div className="w-4 h-[3px] bg-[#f44336]" />
            </div>
            <h1 className="logo-editorial text-[36px] text-white leading-none tracking-[0.1em]"
                style={{ animation: 'fade-in 0.6s ease-out 0.3s both' }}>
              PEGAGOL
            </h1>
            <p className="text-white/15 text-[8px] tracking-[0.4em] uppercase mt-2"
               style={{ animation: 'fade-in 0.6s ease-out 0.5s both' }}>
              WORLD CUP 2026
            </p>
          </div>

          {/* Form - staggered entrance */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div style={{ animation: 'slide-up 0.5s ease-out 0.4s both' }}>
              <label className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em] block mb-2">
                TU NOMBRE
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Carlos"
                maxLength={30}
                className="w-full bg-transparent border-b border-white/15 px-0 py-3
                           text-white placeholder-white/10 focus:outline-none focus:border-white/40
                           transition-colors text-sm tracking-wide"
              />
            </div>

            <div style={{ animation: 'slide-up 0.5s ease-out 0.5s both' }}>
              <label className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em] block mb-3">
                TU SALON
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SALONES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSalon(s)}
                    className={`py-2.5 text-[11px] font-bold transition-all tracking-wider
                      ${salon === s
                        ? 'bg-white text-negro'
                        : 'bg-transparent text-white/25 border border-white/10 hover:border-white/20'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ animation: 'slide-up 0.5s ease-out 0.6s both' }}>
              <button
                type="submit"
                disabled={!nombre.trim() || !salon || loading}
                className="btn-primary w-full disabled:opacity-20 disabled:cursor-not-allowed"
              >
                {loading ? 'ENTRANDO...' : 'ENTRAR'}
              </button>
            </div>
          </form>

          {/* Demo login */}
          <div style={{ animation: 'fade-in 0.5s ease-out 0.8s both' }}>
            <button
              onClick={handleDemoLogin}
              className="w-full mt-6 text-white/15 text-[10px] hover:text-white/30 transition-colors
                         tracking-[0.15em] uppercase"
            >
              Entrar como usuario de prueba
            </button>

            {showDemo && (
              <div className="mt-3 border border-white/[0.06] p-4 space-y-2 animate-fade-in">
                <p className="text-white/20 text-[9px] uppercase tracking-[0.2em] mb-3">Elige un usuario:</p>
                {demoUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => loginAsDemo(u)}
                    className="w-full text-left bg-white/[0.03] hover:bg-white/[0.06] px-4 py-2.5
                               text-white/50 text-[11px] transition-colors border border-white/[0.04]
                               hover:border-white/10"
                  >
                    <span className="font-semibold text-white/70">{u.nombre}</span>
                    <span className="text-white/20 ml-2 text-[10px]">Salon {u.salon}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
