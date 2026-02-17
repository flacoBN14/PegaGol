import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { searchStickers, createTrade, getUserAlbum } from '../lib/api';
import { getFlag } from '../lib/constants';

export default function Search() {
  const { user } = useUser();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(null);
  const [myRepeats, setMyRepeats] = useState([]);
  const [sending, setSending] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchStickers(query.trim(), user?.id);
      setResults(data);
    } catch {
      console.error('Error buscando');
    } finally {
      setLoading(false);
    }
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
    <div className="px-4 pt-4 pb-4">
      <h2 className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3">BUSCAR ESTAMPAS</h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Codigo, equipo o jugador..."
          className="flex-1 bg-negro-light border border-white/10 rounded-sm px-4 py-3
                     text-sm text-white placeholder-white/20 focus:outline-none focus:border-dorado"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-dorado text-negro px-5 py-3 rounded-sm font-bold text-sm
                     hover:bg-dorado-dark transition-colors active:scale-95"
        >
          {loading ? '...' : 'BUSCAR'}
        </button>
      </form>

      {results.length === 0 && query && !loading && (
        <div className="text-center text-white/20 mt-10">
          <p className="text-4xl mb-2">🔍</p>
          <p className="text-xs uppercase tracking-wider">No se encontraron resultados</p>
        </div>
      )}

      <div className="space-y-3">
        {results.map((sticker) => (
          <div key={sticker.id} className="bg-negro-light border border-white/5 rounded-sm p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-14 rounded-sm bg-gradient-to-b from-verde-dark to-verde
                              flex flex-col items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-[8px] text-white/50">{getFlag(sticker.equipo)}</span>
                <span className="text-dorado text-[10px] font-bold">{sticker.codigo}</span>
              </div>
              <div>
                <div className="font-bold text-white/80 text-sm">{sticker.nombreJugador}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider">{sticker.equipo}</div>
              </div>
            </div>

            {sticker.disponibleEn.length > 0 ? (
              <div className="mt-2 space-y-2">
                <p className="text-[10px] text-verde uppercase tracking-wider font-bold">
                  Disponible con:
                </p>
                {sticker.disponibleEn.map((owner) => (
                  <div key={owner.userId}
                       className="flex items-center justify-between bg-white/[0.03] rounded-sm px-3 py-2">
                    <div>
                      <span className="font-bold text-xs text-white/70">{owner.nombre}</span>
                      <span className="text-[10px] text-white/30 ml-2">Salon {owner.salon}</span>
                    </div>
                    <button
                      onClick={() => openTradeModal(sticker, owner)}
                      className="bg-dorado text-negro text-[10px] font-bold px-3 py-1.5
                                 rounded-sm hover:bg-dorado-dark transition-colors active:scale-95
                                 uppercase tracking-wider"
                    >
                      PEDIR
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-white/20 mt-1">
                Nadie la tiene repetida por ahora
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50"
             onClick={() => setShowTradeModal(null)}>
          <div className="bg-negro-light border-t border-white/10 w-full max-w-md p-6 max-h-[70vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-0.5 bg-white/10 mx-auto mb-4" />
            <h3 className="text-sm text-white/80 uppercase tracking-wider mb-1">Proponer intercambio</h3>
            <p className="text-[10px] text-white/30 mb-4">
              Quieres la <strong className="text-dorado">{showTradeModal.sticker.codigo}</strong> de {showTradeModal.owner.nombre}.
              Elige que estampa repetida le ofreces:
            </p>

            {myRepeats.length === 0 ? (
              <p className="text-center text-white/20 text-xs py-6">
                No tienes estampas repetidas para ofrecer
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {myRepeats.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleProposeTrade(s.id)}
                    disabled={sending}
                    className="bg-gradient-to-b from-dorado-dark to-dorado rounded-sm p-2 text-center
                               hover:opacity-90 transition-all active:scale-95 disabled:opacity-30"
                  >
                    <div className="text-[9px] font-bold text-negro">{s.codigo}</div>
                    <div className="text-[8px] text-negro/60 truncate">{s.nombreJugador}</div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowTradeModal(null)}
              className="w-full mt-4 py-3 text-white/20 text-xs uppercase tracking-wider"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
