import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { searchStickers, createTrade, getUserAlbum } from '../lib/api';
import TeamBadge from '../components/TeamBadge';

export default function Search() {
  const { user } = useUser();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(null);
  const [myRepeats, setMyRepeats] = useState([]);
  const [sending, setSending] = useState(false);

  // Auto-search with debounce
  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const data = await searchStickers(q.trim(), user?.id);
      setResults(data);
    } catch {
      console.error('Error buscando');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) doSearch(query);
      else setResults([]);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) doSearch(query);
  };

  const openTradeModal = async (sticker, owner) => {
    try {
      const album = await getUserAlbum(user.id);
      const repeats = [];
      for (const stickers of Object.values(album.equipos)) {
        for (const s of stickers) {
          if (s.cantidad >= 2) repeats.push(s);
        }
      }
      setMyRepeats(repeats);
      setShowTradeModal({ sticker, owner });
    } catch {
      alert('Error cargando tus repetidas');
    }
  };

  const handleProposeTrade = async (offerStickerId) => {
    setSending(true);
    try {
      await createTrade({
        fromUserId: user.id,
        toUserId: showTradeModal.owner.userId,
        offerStickerId,
        requestStickerId: showTradeModal.sticker.id,
      });
      alert('Intercambio propuesto!');
      setShowTradeModal(null);
    } catch {
      alert('Error al proponer intercambio');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="px-5 pt-5 pb-4">
      {/* Header */}
      <h2 className="font-display text-[28px] text-white leading-none tracking-wide mb-1">
        BUSCAR
      </h2>
      <p className="text-[9px] text-white/15 tracking-[0.2em] uppercase mb-5">
        Encuentra estampas que necesitas
      </p>

      {/* Search input - cleaner, auto-search */}
      <form onSubmit={handleSearch} className="relative mb-5">
        <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Jugador, equipo o codigo..."
          className="w-full bg-transparent border-b border-white/10 pl-7 pr-2 py-3
                     text-sm text-white placeholder-white/15 focus:outline-none focus:border-white/30
                     transition-colors tracking-wide"
        />
        {loading && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
      </form>

      {/* Quick hints */}
      {!query && results.length === 0 && (
        <div className="text-center mt-16">
          <div className="w-12 h-12 border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-[10px] text-white/15 tracking-[0.15em] uppercase">
            Escribe para buscar
          </p>
          <p className="text-[8px] text-white/10 mt-1 tracking-wider">
            Ejemplo: Messi, ARG01, Argentina
          </p>
        </div>
      )}

      {query && results.length === 0 && !loading && (
        <div className="text-center mt-16">
          <div className="w-12 h-12 border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <span className="text-white/15 text-lg">-</span>
          </div>
          <p className="text-[10px] text-white/15 tracking-[0.15em] uppercase">
            Sin resultados
          </p>
        </div>
      )}

      {/* Results */}
      <div className="space-y-[2px]">
        {results.map((sticker) => (
          <div key={sticker.id} className="card-adidas p-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-12 bg-white/[0.04] border border-white/[0.06]
                              flex flex-col items-center justify-center flex-shrink-0">
                <TeamBadge team={sticker.equipo} size="xs" />
                <span className="text-white/30 text-[8px] font-bold mt-0.5">{sticker.codigo}</span>
              </div>
              <div>
                <div className="font-semibold text-white/70 text-[12px] tracking-wide">{sticker.nombreJugador}</div>
                <div className="text-[9px] text-white/20 uppercase tracking-[0.15em]">{sticker.equipo}</div>
              </div>
            </div>

            {sticker.disponibleEn.length > 0 ? (
              <div className="space-y-1">
                {sticker.disponibleEn.map((owner) => (
                  <div key={owner.userId}
                       className="flex items-center justify-between bg-white/[0.02] px-3 py-2">
                    <div>
                      <span className="font-semibold text-[11px] text-white/60">{owner.nombre}</span>
                      <span className="text-[9px] text-white/15 ml-2">{owner.salon}</span>
                    </div>
                    <button
                      onClick={() => openTradeModal(sticker, owner)}
                      className="bg-white text-negro text-[9px] font-bold px-3 py-1.5
                                 hover:bg-white/90 transition-colors active:scale-95
                                 uppercase tracking-[0.1em]"
                    >
                      PEDIR
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[9px] text-white/15 tracking-wider">
                Nadie la tiene repetida
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50"
             onClick={() => setShowTradeModal(null)}>
          <div className="bg-negro-light w-full max-w-md p-6 max-h-[70vh] overflow-y-auto animate-slide-up"
               onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-[2px] bg-white/10 mx-auto mb-5" />

            <h3 className="font-display text-[20px] text-white tracking-wide mb-1">
              PROPONER CAMBIO
            </h3>
            <p className="text-[10px] text-white/25 mb-5 tracking-wider">
              Quieres <span className="text-white/50 font-semibold">{showTradeModal.sticker.codigo}</span> de {showTradeModal.owner.nombre}.
              Elige que ofreces:
            </p>

            {myRepeats.length === 0 ? (
              <p className="text-center text-white/15 text-[10px] py-8 tracking-wider uppercase">
                No tienes estampas repetidas
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {myRepeats.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleProposeTrade(s.id)}
                    disabled={sending}
                    className="bg-white/[0.04] border border-white/[0.08] p-2 text-center
                               hover:bg-white/[0.08] transition-all active:scale-95 disabled:opacity-20"
                  >
                    <div className="text-[9px] font-bold text-white/50">{s.codigo}</div>
                    <div className="text-[7px] text-white/20 truncate">{s.nombreJugador}</div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowTradeModal(null)}
              className="w-full mt-5 py-3 text-white/15 text-[10px] uppercase tracking-[0.2em]
                         hover:text-white/30 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
