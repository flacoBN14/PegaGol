import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { getUserAlbum, toggleSticker } from '../lib/api';
import { isPlayoffTeam } from '../lib/constants';
import { GROUPS } from '../lib/groupData';
import TeamBadge from '../components/TeamBadge';

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

  // Organize teams by World Cup groups
  const teamsByGroup = useMemo(() => {
    if (!album) return [];
    const groupKeys = Object.keys(GROUPS).sort();
    const result = [];

    // Teams that are in groups
    const teamsInGroups = new Set();

    for (const key of groupKeys) {
      const group = GROUPS[key];
      const groupTeams = group.teams
        .filter(team => team !== 'Por definir' && album.equipos[team])
        .map(team => {
          teamsInGroups.add(team);
          return { name: team, stickers: album.equipos[team] };
        });

      if (groupTeams.length > 0) {
        result.push({ key, label: `GRUPO ${key}`, teams: groupTeams, isPlayoff: false });
      }
    }

    // Playoff teams not in any group
    const playoffTeams = Object.keys(album.equipos)
      .filter(team => !teamsInGroups.has(team) && isPlayoffTeam(team))
      .map(team => ({ name: team, stickers: album.equipos[team] }));

    if (playoffTeams.length > 0) {
      result.push({ key: 'PO', label: 'REPECHAJE', teams: playoffTeams, isPlayoff: true });
    }

    return result;
  }, [album]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/30 text-[11px] animate-pulse uppercase tracking-[0.2em]">
          Cargando album...
        </div>
      </div>
    );
  }

  if (!album) return null;

  const { stats } = album;
  const total = stats.tiene + stats.faltan;
  const percent = total > 0 ? Math.round((stats.tiene / total) * 100) : 0;

  return (
    <div className="pb-4">
      {/* Stats Header - Adidas style */}
      <div className="mx-5 mt-5">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="font-display text-[28px] text-white leading-none tracking-wide">
              MI ALBUM
            </h2>
            <p className="text-[9px] text-white/15 tracking-[0.2em] uppercase mt-1">
              {stats.tiene} de {total} estampas
            </p>
          </div>
          <span className="font-display text-[40px] text-white leading-none">{percent}%</span>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-track mb-5">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
        </div>

        {/* Stat blocks */}
        <div className="grid grid-cols-3 gap-[1px] bg-white/[0.04]">
          <div className="bg-negro py-4 text-center">
            <div className="font-display text-[24px] text-white leading-none">{stats.tiene}</div>
            <div className="text-[8px] text-white/20 tracking-[0.2em] uppercase mt-1">Tengo</div>
          </div>
          <div className="bg-negro py-4 text-center">
            <div className="font-display text-[24px] text-white leading-none">{stats.repetidas}</div>
            <div className="text-[8px] text-white/20 tracking-[0.2em] uppercase mt-1">Repetidas</div>
          </div>
          <div className="bg-negro py-4 text-center">
            <div className="font-display text-[24px] text-white/30 leading-none">{stats.faltan}</div>
            <div className="text-[8px] text-white/20 tracking-[0.2em] uppercase mt-1">Faltan</div>
          </div>
        </div>
      </div>

      <p className="text-center text-[8px] text-white/10 mt-4 mb-2 px-5 tracking-[0.15em] uppercase">
        Toca: falta &rarr; tengo &rarr; repetida
      </p>

      {/* Teams by Group */}
      <div className="px-5 mt-3 space-y-5">
        {teamsByGroup.map((group) => {
          const groupOwned = group.teams.reduce((sum, t) =>
            sum + t.stickers.filter(s => s.cantidad > 0).length, 0);
          const groupTotal = group.teams.reduce((sum, t) => sum + t.stickers.length, 0);

          return (
            <div key={group.key}>
              {/* Group header */}
              <div className="flex items-center gap-3 mb-2">
                <span className={`font-display text-[14px] tracking-wide ${
                  group.isPlayoff ? 'text-white/20' : 'text-white/50'
                }`}>
                  {group.label}
                </span>
                {group.isPlayoff && (
                  <span className="text-[7px] border border-white/10 text-white/25 px-1.5 py-0.5 uppercase tracking-wider">
                    Por confirmar
                  </span>
                )}
                <span className="text-[9px] text-white/10 font-medium">{groupOwned}/{groupTotal}</span>
                <div className="flex-1 h-[1px] bg-white/[0.04]" />
              </div>

              {/* Teams in this group */}
              <div className="space-y-[2px]">
                {group.teams.map(({ name, stickers }) => {
                  const owned = stickers.filter(s => s.cantidad > 0).length;
                  const isOpen = openTeam === name;
                  const isPlayoff = isPlayoffTeam(name);

                  return (
                    <div key={name} className={`card-adidas overflow-hidden ${
                      isPlayoff ? 'border-dashed opacity-70' : ''
                    }`}>
                      <button
                        onClick={() => setOpenTeam(isOpen ? null : name)}
                        className="w-full flex items-center justify-between px-3 py-2.5
                                   hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <TeamBadge team={name} size="sm" />
                          <div className="text-left">
                            <span className="font-semibold text-white/70 text-[11px] uppercase tracking-wide block">
                              {name}
                            </span>
                            <span className="text-[9px] text-white/15">{owned}/{stickers.length}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* Mini progress */}
                          <div className="w-12 h-[2px] bg-white/[0.04]">
                            <div
                              className="h-[2px] bg-white/40 transition-all"
                              style={{ width: `${(owned / stickers.length) * 100}%` }}
                            />
                          </div>
                          <svg
                            className={`w-3 h-3 text-white/15 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-2 pb-2 grid grid-cols-4 gap-1 animate-fade-in">
                          {stickers.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => handleToggle(s.id)}
                              className={`relative overflow-hidden text-center transition-all active:scale-95
                                ${s.cantidad === 0
                                  ? 'sticker-empty'
                                  : s.cantidad === 1
                                    ? 'sticker-owned'
                                    : 'sticker-repeat'
                                }`}
                            >
                              {s.numero === 1 && s.cantidad > 0 ? (
                                <div className="px-1 py-2 flex flex-col items-center gap-1">
                                  <TeamBadge team={s.equipo || name} size="xs" />
                                  <div className="text-[7px] text-white/60 font-semibold uppercase tracking-wide">Escudo</div>
                                  <div className="text-[8px] font-bold text-white/40">{s.codigo}</div>
                                </div>
                              ) : (
                                <>
                                  <div className={`text-[8px] font-bold py-0.5
                                    ${s.cantidad === 0 ? 'bg-white/[0.02] text-white/15' : 'bg-white/[0.06] text-white/50'}`}>
                                    {s.codigo}
                                  </div>
                                  <div className="px-1 py-1.5">
                                    <div className={`text-[7px] leading-tight truncate
                                      ${s.cantidad === 0 ? 'text-white/10' : 'text-white/60 font-medium'}`}>
                                      {s.nombreJugador}
                                    </div>
                                  </div>
                                </>
                              )}
                              {s.cantidad >= 2 && (
                                <div className="absolute inset-0 sticker-shine pointer-events-none" />
                              )}
                              {s.cantidad >= 2 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-white text-negro
                                                 text-[8px] font-bold w-3.5 h-3.5 flex items-center
                                                 justify-center">
                                  {s.cantidad}
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
