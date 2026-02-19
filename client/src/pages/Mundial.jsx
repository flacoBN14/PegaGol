import { useState, useMemo } from 'react';
import TeamBadge from '../components/TeamBadge';
import { CONFEDERATIONS, isPlayoffTeam } from '../lib/constants';
import { GROUPS } from '../lib/groupData';
import { TEAM_DATA } from '../lib/teamData';
import { PLAYER_DATA, TEAM_PLAYERS } from '../lib/playerData';
import { MATCH_SCHEDULE } from '../lib/matchSchedule';

const POSITION_COLORS = {
  GK: 'bg-[#ffd600]/10 text-[#ffd600] border-[#ffd600]/20',
  DEF: 'bg-[#2196f3]/10 text-[#2196f3] border-[#2196f3]/20',
  MID: 'bg-[#00c853]/10 text-[#00c853] border-[#00c853]/20',
  FWD: 'bg-[#f44336]/10 text-[#f44336] border-[#f44336]/20',
};

const POSITION_LABELS = { GK: 'POR', DEF: 'DEF', MID: 'MED', FWD: 'DEL' };

export default function Mundial() {
  const [activeTab, setActiveTab] = useState('grupos');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [filterTeam, setFilterTeam] = useState('');

  const tabs = [
    { id: 'grupos', label: 'GRUPOS' },
    { id: 'calendario', label: 'PARTIDOS' },
    { id: 'equipos', label: 'EQUIPOS' },
  ];

  return (
    <div className="pb-4">
      {/* Sub-tabs */}
      <div className="flex bg-negro sticky top-0 z-10 border-b border-white/[0.04]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedTeam(null); setSelectedGroup(null); }}
            className={`flex-1 py-3.5 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors relative
              ${activeTab === tab.id ? 'text-white' : 'text-white/20 hover:text-white/35'}`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="tab-active-line" />}
          </button>
        ))}
      </div>

      {activeTab === 'grupos' && (
        <GroupsView selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup}
          setSelectedTeam={setSelectedTeam} setActiveTab={setActiveTab} />
      )}
      {activeTab === 'calendario' && (
        <CalendarView filterTeam={filterTeam} setFilterTeam={setFilterTeam} />
      )}
      {activeTab === 'equipos' && (
        <TeamsView selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} />
      )}
    </div>
  );
}

// ===================== GRUPOS =====================
function GroupsView({ selectedGroup, setSelectedGroup, setSelectedTeam, setActiveTab }) {
  const groupKeys = Object.keys(GROUPS).sort();

  return (
    <div className="px-5 mt-5">
      <h2 className="font-display text-[28px] text-white leading-none tracking-wide mb-1">
        GRUPOS
      </h2>
      <p className="text-[9px] text-white/15 tracking-[0.2em] uppercase mb-5">
        FIFA WORLD CUP 2026
      </p>

      <div className="grid grid-cols-2 gap-[2px]">
        {groupKeys.map(key => {
          const group = GROUPS[key];
          const isOpen = selectedGroup === key;

          return (
            <button
              key={key}
              onClick={() => setSelectedGroup(isOpen ? null : key)}
              className={`card-adidas p-3.5 text-left transition-all
                ${isOpen ? 'border-white/15 col-span-2' : ''}`}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className="font-display text-[16px] text-white/70 tracking-wide">
                  GRUPO {key}
                </span>
                {group.venues && group.venues[0] && (
                  <span className="text-[7px] text-white/10 truncate">{group.venues[0]}</span>
                )}
              </div>
              <div className="space-y-1.5">
                {group.teams.map((team, i) => {
                  const teamData = TEAM_DATA[team];
                  const isPlayoff = isPlayoffTeam(team) || team === 'Por definir';

                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-2 ${isPlayoff ? 'opacity-40' : ''}`}
                      onClick={(e) => {
                        if (isOpen && team !== 'Por definir') {
                          e.stopPropagation();
                          setSelectedTeam(team);
                          setActiveTab('equipos');
                        }
                      }}
                    >
                      {team === 'Por definir' ? (
                        <span className="w-5 h-5 bg-white/[0.03] border border-dashed border-white/10
                                         flex items-center justify-center text-[7px] text-white/20">?</span>
                      ) : (
                        <TeamBadge team={team} size="xs" />
                      )}
                      <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                        isPlayoff ? 'text-white/20' : 'text-white/50'
                      }`}>
                        {team}
                      </span>
                      {teamData && isOpen && (
                        <span className="text-[8px] text-white/15 ml-auto">#{teamData.fifaRanking}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ===================== CALENDARIO =====================
function CalendarView({ filterTeam, setFilterTeam }) {
  const allTeams = useMemo(() => {
    const teams = new Set();
    MATCH_SCHEDULE.forEach(m => {
      if (m.teamA !== 'Por definir') teams.add(m.teamA);
      if (m.teamB !== 'Por definir') teams.add(m.teamB);
    });
    return [...teams].sort();
  }, []);

  const filteredMatches = useMemo(() => {
    if (!filterTeam) return MATCH_SCHEDULE;
    return MATCH_SCHEDULE.filter(m => m.teamA === filterTeam || m.teamB === filterTeam);
  }, [filterTeam]);

  const matchesByDate = useMemo(() => {
    const grouped = {};
    filteredMatches.forEach(m => {
      if (!grouped[m.date]) grouped[m.date] = [];
      grouped[m.date].push(m);
    });
    return grouped;
  }, [filteredMatches]);

  const dates = Object.keys(matchesByDate).sort();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  return (
    <div className="px-5 mt-5">
      <h2 className="font-display text-[28px] text-white leading-none tracking-wide mb-1">
        PARTIDOS
      </h2>
      <p className="text-[9px] text-white/15 tracking-[0.2em] uppercase mb-5">
        {filteredMatches.length} partidos en fase de grupos
      </p>

      {/* Filter */}
      <div className="relative mb-5">
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="w-full bg-transparent border-b border-white/10 px-0 py-3
                     text-[11px] text-white/50 focus:outline-none focus:border-white/30
                     transition-colors tracking-wide appearance-none cursor-pointer"
        >
          <option value="" className="bg-negro">Todos los equipos</option>
          {allTeams.map(team => (
            <option key={team} value={team} className="bg-negro">{team}</option>
          ))}
        </select>
        <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/15 pointer-events-none"
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Matches by date */}
      <div className="space-y-5">
        {dates.map(date => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">
                {formatDate(date)}
              </span>
              <div className="flex-1 h-[1px] bg-white/[0.04]" />
            </div>

            <div className="space-y-[2px]">
              {matchesByDate[date].map(match => (
                <div key={match.id} className="card-adidas p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] text-white/20 font-bold tracking-[0.15em]">
                      GRUPO {match.group}
                    </span>
                    <span className="text-[8px] text-white/15">{match.time}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {match.teamA === 'Por definir' ? (
                        <span className="w-5 h-5 bg-white/[0.03] border border-dashed border-white/10
                                         flex items-center justify-center text-[7px] text-white/20">?</span>
                      ) : (
                        <TeamBadge team={match.teamA} size="xs" />
                      )}
                      <span className="text-[10px] font-semibold text-white/50 uppercase truncate">
                        {match.teamA}
                      </span>
                    </div>

                    <div className="px-3">
                      {match.scoreA !== null ? (
                        <span className="font-display text-[16px] text-white">
                          {match.scoreA} - {match.scoreB}
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/15 font-bold tracking-wider">VS</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-[10px] font-semibold text-white/50 uppercase truncate text-right">
                        {match.teamB}
                      </span>
                      {match.teamB === 'Por definir' ? (
                        <span className="w-5 h-5 bg-white/[0.03] border border-dashed border-white/10
                                         flex items-center justify-center text-[7px] text-white/20">?</span>
                      ) : (
                        <TeamBadge team={match.teamB} size="xs" />
                      )}
                    </div>
                  </div>

                  <div className="text-[7px] text-white/10 mt-2 text-center truncate tracking-wider">
                    {match.venue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== EQUIPOS =====================
function TeamsView({ selectedTeam, setSelectedTeam }) {
  const groupKeys = Object.keys(GROUPS).sort();

  const playoffTeams = useMemo(() => {
    const teamsInGroups = new Set();
    Object.values(GROUPS).forEach(g => g.teams.forEach(t => teamsInGroups.add(t)));
    const playoff = [];
    CONFEDERATIONS.forEach(conf => {
      if (conf.id === 'PLAYOFF') {
        conf.teams.forEach(team => {
          if (!teamsInGroups.has(team)) playoff.push(team);
        });
      }
    });
    return playoff;
  }, []);

  if (selectedTeam) {
    return <TeamDetail team={selectedTeam} onBack={() => setSelectedTeam(null)} />;
  }

  return (
    <div className="px-5 mt-5">
      <h2 className="font-display text-[28px] text-white leading-none tracking-wide mb-1">
        EQUIPOS
      </h2>
      <p className="text-[9px] text-white/15 tracking-[0.2em] uppercase mb-5">
        48 selecciones por grupo
      </p>

      <div className="space-y-5">
        {groupKeys.map(key => {
          const group = GROUPS[key];
          return (
            <div key={key}>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-display text-[14px] text-white/40 tracking-wide">
                  GRUPO {key}
                </span>
                <div className="flex-1 h-[1px] bg-white/[0.04]" />
              </div>
              <div className="space-y-[2px]">
                {group.teams.map((name, i) => {
                  const data = TEAM_DATA[name] || {};
                  const isPlayoff = isPlayoffTeam(name) || name === 'Por definir';

                  if (name === 'Por definir') {
                    return (
                      <div key={`${key}-tbd-${i}`}
                           className="card-adidas border-dashed p-3.5 opacity-30 flex items-center gap-3">
                        <span className="w-7 h-7 bg-white/[0.03] border border-dashed border-white/10
                                         flex items-center justify-center text-[9px] text-white/20">?</span>
                        <span className="text-[10px] text-white/20 uppercase tracking-wide">
                          Por definir (Repechaje)
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={name}
                      onClick={() => setSelectedTeam(name)}
                      className={`w-full flex items-center gap-3 card-adidas p-3.5 text-left
                                 ${isPlayoff ? 'border-dashed opacity-60' : ''}`}
                    >
                      <TeamBadge team={name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white/60 text-[11px] uppercase tracking-wide">{name}</span>
                          {isPlayoff && (
                            <span className="text-[7px] border border-white/10 text-white/20 px-1 py-px uppercase">
                              ?
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[8px] text-white/15">{data.confederation || ''}</span>
                          {data.fifaRanking && (
                            <span className="text-[8px] text-white/25">#{data.fifaRanking}</span>
                          )}
                        </div>
                      </div>
                      {data.worldCupsWon > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] text-white/20 font-bold">{data.worldCupsWon}x</span>
                          <span className="text-[9px]">&#9733;</span>
                        </div>
                      )}
                      <svg className="w-3 h-3 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Playoff teams */}
        {playoffTeams.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-display text-[14px] text-white/20 tracking-wide">REPECHAJE</span>
              <span className="text-[7px] border border-white/10 text-white/15 px-1.5 py-0.5 uppercase tracking-wider">
                Por confirmar
              </span>
              <div className="flex-1 h-[1px] bg-white/[0.04]" />
            </div>
            <div className="space-y-[2px]">
              {playoffTeams.map(name => {
                const data = TEAM_DATA[name] || {};
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedTeam(name)}
                    className="w-full flex items-center gap-3 card-adidas border-dashed p-3.5 text-left opacity-60"
                  >
                    <TeamBadge team={name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-white/60 text-[11px] uppercase tracking-wide">{name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] text-white/15">{data.confederation || ''}</span>
                        {data.fifaRanking && <span className="text-[8px] text-white/25">#{data.fifaRanking}</span>}
                      </div>
                    </div>
                    {data.worldCupsWon > 0 && (
                      <span className="text-[8px] text-white/20 font-bold">{data.worldCupsWon}x &#9733;</span>
                    )}
                    <svg className="w-3 h-3 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== DETALLE EQUIPO =====================
function TeamDetail({ team, onBack }) {
  const data = TEAM_DATA[team] || {};
  const isPlayoff = isPlayoffTeam(team);
  const playerNames = TEAM_PLAYERS[team] || [];

  const players = useMemo(() => {
    return playerNames.map(name => ({
      name,
      ...(PLAYER_DATA[name] || { position: 'MID', number: 0, birthYear: 2000 }),
    })).sort((a, b) => {
      const order = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
      return (order[a.position] || 2) - (order[b.position] || 2);
    });
  }, [playerNames]);

  return (
    <div className="px-5 mt-5 animate-fade-in">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-white/20 hover:text-white/40 mb-5 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-[9px] uppercase tracking-[0.2em]">Volver</span>
      </button>

      {/* Team header */}
      <div className={`card-adidas p-6 text-center mb-4 ${isPlayoff ? 'border-dashed' : ''}`}>
        <TeamBadge team={team} size="xl" />
        <h2 className="font-display text-[28px] text-white tracking-wide mt-3 leading-none">{team}</h2>
        {data.nickname && (
          <p className="text-[10px] text-white/20 mt-1 tracking-wider italic">{data.nickname}</p>
        )}

        {isPlayoff && (
          <div className="mt-3 border border-white/10 text-white/25 text-[8px] px-3 py-1.5 inline-block uppercase tracking-[0.15em]">
            Por confirmar
          </div>
        )}

        <div className="grid grid-cols-3 gap-[1px] mt-5 bg-white/[0.04]">
          <div className="bg-negro py-3">
            <div className="font-display text-[22px] text-white leading-none">#{data.fifaRanking || '?'}</div>
            <div className="text-[7px] text-white/15 uppercase tracking-[0.2em] mt-1">Ranking</div>
          </div>
          <div className="bg-negro py-3">
            <div className="font-display text-[22px] text-white leading-none">{data.worldCupsWon || 0}</div>
            <div className="text-[7px] text-white/15 uppercase tracking-[0.2em] mt-1">Mundiales</div>
          </div>
          <div className="bg-negro py-3">
            <div className="font-display text-[22px] text-white leading-none">{data.group === 'PO' ? '?' : data.group || '?'}</div>
            <div className="text-[7px] text-white/15 uppercase tracking-[0.2em] mt-1">Grupo</div>
          </div>
        </div>

        {data.coach && (
          <div className="mt-4 text-[10px]">
            <span className="text-white/10 uppercase tracking-[0.15em]">DT </span>
            <span className="text-white/35">{data.coach}</span>
          </div>
        )}
      </div>

      {/* Players */}
      <div className="card-adidas overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
          <h3 className="font-display text-[14px] text-white/50 tracking-wide">PLANTEL</h3>
          <span className="text-[8px] text-white/15 tracking-wider">{players.length} jugadores</span>
        </div>

        <div>
          {players.map((player, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.02]
                                    hover:bg-white/[0.01] transition-colors">
              <span className="text-[10px] font-display text-white/15 w-5 text-right">
                {player.number || '-'}
              </span>
              <span className={`text-[7px] font-bold px-1.5 py-0.5 border uppercase tracking-wider
                ${POSITION_COLORS[player.position] || POSITION_COLORS.MID}`}>
                {POSITION_LABELS[player.position] || 'MED'}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-white/50 truncate block tracking-wide">{player.name}</span>
              </div>
              <span className="text-[8px] text-white/10">
                {player.birthYear ? `${2026 - player.birthYear}a` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
