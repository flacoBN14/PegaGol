import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { registerUser, getUsers } from '../lib/api';

const SALONES = ['5-A', '5-B', '5-C', '6-A', '6-B', '6-C'];

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [salon, setSalon] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !salon) return;
    setLoading(true);
    try {
      const user = await registerUser(nombre.trim(), salon);
      login(user);
      navigate('/album', { replace: true });
    } catch {
      alert('Error al registrarse. Intenta de nuevo.');
    } finally {
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
    navigate('/album', { replace: true });
  };

  return (
    <div className="min-h-dvh bg-negro flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-verde/5 rounded-full blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.03]"
           style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, white 40px, white 41px)' }} />

      <div className="w-full max-w-sm z-10">
        <div className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="text-3xl text-dorado mt-2 tracking-wider">PEGAGOL</h1>
          <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mt-1">MUNDIAL FIFA 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-negro-light/80 border border-white/10 rounded-sm p-6 space-y-5">
          <div>
            <label className="text-white/50 text-[10px] font-bold uppercase tracking-wider block mb-2">
              TU NOMBRE
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Carlos"
              maxLength={30}
              className="w-full bg-negro border border-white/10 rounded-sm px-4 py-3
                         text-white placeholder-white/20 focus:outline-none focus:border-dorado
                         transition-colors text-sm"
            />
          </div>

          <div>
            <label className="text-white/50 text-[10px] font-bold uppercase tracking-wider block mb-2">
              TU SALON
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SALONES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSalon(s)}
                  className={`py-2.5 rounded-sm text-sm font-bold transition-all
                    ${salon === s
                      ? 'bg-dorado text-negro'
                      : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!nombre.trim() || !salon || loading}
            className="w-full bg-dorado hover:bg-dorado-dark text-negro font-russo
                       text-base py-3.5 rounded-sm disabled:opacity-30
                       disabled:cursor-not-allowed transition-all active:scale-[0.98]
                       uppercase tracking-wider"
          >
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <button
          onClick={handleDemoLogin}
          className="w-full mt-4 text-white/20 text-xs hover:text-white/40 transition-colors"
        >
          Entrar como usuario de prueba
        </button>

        {showDemo && (
          <div className="mt-3 bg-negro-light border border-white/10 rounded-sm p-4 space-y-2">
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Elige un usuario:</p>
            {demoUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => loginAsDemo(u)}
                className="w-full text-left bg-white/5 hover:bg-white/10 rounded-sm px-4 py-2.5
                           text-white/70 text-sm transition-colors border border-white/5"
              >
                <span className="font-bold">{u.nombre}</span>
                <span className="text-white/30 ml-2">Salon {u.salon}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
