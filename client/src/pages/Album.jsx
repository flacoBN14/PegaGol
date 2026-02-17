import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { getUserAlbum, toggleSticker } from '../lib/api';
import { CONFEDERATIONS, getFlag } from '../lib/constants';

export default function Album() {
  const { user } = useUser();
  const [album, setAlbum] = useState(null);
  const [openTeam, setOpenTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAlbum = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getUserAlbum(user.id);
      setAlbum(data);
    } catch {
      console.error('Error cargando album');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadAlbum(); }, [loadAlbum]);

  const handleToggle = async (stickerId) => {
    setAlbum(prev => {
      if (!prev) return prev;
      const updated = { ...prev, equipos: { ...prev.equipos } };
      let deltaHas = 0, deltaRep = 0, deltaMiss = 0;

      for (const [equipo, stickers] of Object.entries(updated.equipos)) {
        const idx = stickers.findIndex(s => s.id === stickerId);
        if (idx !== -1) {
          const newStickers = [...stickers];
          const s = { ...newStickers[idx] };
          const oldCant = s.cantidad;

          if (oldCant === 0) { s.cantidad = 1; deltaHas = 1; deltaMiss = -1; }
          else if (oldCant === 1) { s.cantidad = 2; deltaRep = 1; }
          else { s.cantidad = 0; deltaHas = -1; deltaRep = -(oldCant - 1); deltaMiss = 1; }

          newStickers[idx] = s;
          updated.equipos[equipo] = newStickers;
          break;
        }
      }

      updated.stats = {
        tiene: prev.stats.tiene + deltaHas,
        repetidas: prev.stats.repetidas + deltaRep,
        faltan: prev.stats.faltan + deltaMiss,
      };
      return updated;
    });

    try {
      await toggleSticker(user.id, stickerId);
    } catch {
      await loadAlbum();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-dorado text-sm animate-pulse uppercase tracking-wider">Cargando album...</div>
      </div>
    );
  }

  if (!album) return null;

  const { stats, equipos } = album;
  const total = stats.tiene + stats.faltan;
  const percent = total > 0 ? Math.round((stats.tiene / total) * 100) : 0;

  return (
    <div className="pb-4">
      {/* Stats */}
      <div className="bg-negro-light border border-white/5 rounded-sm mx-4 mt-4 p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[10px] text-white/30 uppercase tracking-[0.2em]">MI ALBUM</h2>
          <span className="text-dorado font-russo text-2xl">{percent}%</span>
        </div>

        <div className="w-full bg-white/5 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-verde to-dorado h-2 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/5 rounded-sm py-3">
            <div className="text-verde font-russo text-xl">{stats.tiene}</div>
            <div className="text-white/30 text-[9px] uppercase tracking-wider">Tengo</div>
          </div>
          <div className="bg-white/5 rounded-sm py-3">
            <div className="text-dorado font-russo text-xl">{stats.repetidas}</div>
            <div className="text-white/30 text-[9px] uppercase tracking-wider">Repetidas</div>
          </div>
          <div className="bg-white/5 rounded-sm py-3">
            <div className="text-white/40 font-russo text-xl">{stats.faltan}</div>
            <div className="text-white/30 text-[9px] uppercase tracking-wider">Faltan</div>
          </div>
        </div>
      </div>

      <p className="text-center text-[9px] text-white/15 mt-3 mb-1 px-4 uppercase tracking-wider">
        Toca una estampa: falta &rarr; tengo &rarr; repetida
      </p>

      {/* Confederations */}
      <div className="px-4 mt-2 space-y-4">
        {CONFEDERATIONS.map((conf) => {
          const confTeams = conf.teams
            .filter(team => equipos[team])
            .map(team => ({ name: team, stickers: equipos[team] }));

          if (confTeams.length === 0) return null;

          const confOwned = confTeams.reduce((sum, t) =>
            sum + t.stickers.filter(s => s.cantidad > 0).length, 0);
          const confTotal = confTeams.reduce((sum, t) => sum + t.stickers.length, 0);

          return (
            <div key={conf.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{conf.emoji}</span>
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  {conf.name}
                </h3>
                <span className="text-[10px] text-white/15">{confOwned}/{confTotal}</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="space-y-1">
                {confTeams.map(({ name, stickers }) => {
                  const owned = stickers.filter(s => s.cantidad > 0).length;
                  const isOpen = openTeam === name;

                  return (
                    <div key={name} className="bg-negro-light border border-white/5 rounded-sm overflow-hidden">
                      <button
                        onClick={() => setOpenTeam(isOpen ? null : name)}
                        className="w-full flex items-center justify-between px-3 py-2.5
                                   hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{getFlag(name)}</span>
                          <div className="text-left">
                            <div className="font-bold text-white/80 text-xs uppercase tracking-wide">{name}</div>
                            <div className="text-[10px] text-white/20">{owned}/{stickers.length}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-14 bg-white/5 rounded-full h-1">
                            <div
                              className="bg-verde h-1 rounded-full transition-all"
                              style={{ width: `${(owned / stickers.length) * 100}%` }}
                            />
                          </div>
                          <svg
                            className={`w-3.5 h-3.5 text-white/20 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-2 pb-2 grid grid-cols-4 gap-1.5 animate-fade-in">
                          {stickers.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => handleToggle(s.id)}
                              className={`relative rounded-sm overflow-hidden text-center transition-all active:scale-95
                                ${s.cantidad === 0
                                  ? 'bg-white/[0.03] border border-dashed border-white/10'
                                  : s.cantidad === 1
                                    ? 'bg-gradient-to-b from-verde-dark to-verde border border-verde/50 shadow-md'
                                    : 'bg-gradient-to-b from-dorado-dark to-dorado border border-dorado/50 shadow-md'
                                }`}
                            >
                              <div className={`text-[9px] font-bold py-0.5
                                ${s.cantidad === 0 ? 'bg-white/[0.03] text-white/20' : 'bg-black/20 text-white/80'}`}>
                                {s.codigo}
                              </div>
                              <div className="px-1 py-1.5">
                                <div className={`text-[8px] leading-tight truncate
                                  ${s.cantidad === 0 ? 'text-white/15' : 'text-white/90 font-semibold'}`}>
                                  {s.nombreJugador}
                                </div>
                              </div>
                              {s.cantidad >= 2 && (
                                <div className="absolute inset-0 sticker-shine pointer-events-none" />
                              )}
                              {s.cantidad >= 2 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-negro text-dorado
                                                 text-[9px] font-bold rounded-sm w-4 h-4 flex items-center
                                                 justify-center shadow border border-dorado/30">
                                  x{s.cantidad}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
