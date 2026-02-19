import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { getUserTrades, updateTrade } from '../lib/api';

export default function Trades() {
  const { user } = useUser();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadTrades = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getUserTrades(user.id);
      setTrades(data);
    } catch {
      console.error('Error cargando intercambios');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadTrades(); }, [loadTrades]);

  // Poll for trade updates (demo mode - no socket)
  useEffect(() => {
    const interval = setInterval(() => loadTrades(), 5000);
    return () => clearInterval(interval);
  }, [loadTrades]);

  const handleAction = async (tradeId, status) => {
    try {
      await updateTrade(tradeId, status);
      await loadTrades();
    } catch {
      alert('Error al actualizar intercambio');
    }
  };

  const filtered = trades.filter((t) => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status !== 'pending';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/20 text-[11px] animate-pulse uppercase tracking-[0.2em]">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-5 pb-4">
      <h2 className="font-display text-[28px] text-white leading-none tracking-wide mb-1">CAMBIOS</h2>
      <p className="text-[9px] text-white/15 tracking-[0.2em] uppercase mb-5">Tus intercambios de estampas</p>

      {/* Filters */}
      <div className="flex gap-[1px] mb-5 bg-white/[0.04]">
        {[
          { key: 'all', label: 'TODOS' },
          { key: 'pending', label: 'PENDIENTES' },
          { key: 'completed', label: 'RESUELTOS' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-1 py-2.5 text-[9px] font-bold transition-all tracking-[0.15em]
              ${filter === key ? 'bg-white text-negro' : 'bg-negro text-white/20 hover:text-white/35'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center mt-16">
          <div className="w-12 h-12 border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <p className="text-[10px] text-white/15 tracking-[0.15em] uppercase">No hay intercambios</p>
          <p className="text-[8px] text-white/10 mt-1 tracking-wider">Busca estampas y propone cambios</p>
        </div>
      ) : (
        <div className="space-y-[2px]">
          {filtered.map((trade) => {
            const isMine = trade.fromUserId === user.id;
            const otherUser = isMine ? trade.toUser : trade.fromUser;
            const sc = {
              pending: { text: 'PENDIENTE', color: 'text-white/40', border: 'border-white/[0.06]' },
              accepted: { text: 'ACEPTADO', color: 'text-[#00c853]', border: 'border-[#00c853]/20' },
              rejected: { text: 'RECHAZADO', color: 'text-[#f44336]', border: 'border-[#f44336]/20' },
            }[trade.status];

            return (
              <div key={trade.id} className={`card-adidas ${sc.border} p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-white/[0.04] flex items-center justify-center text-white/30 text-[11px] font-bold">
                      {otherUser.nombre[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-[11px] text-white/60 tracking-wide">
                        {isMine ? `Para ${otherUser.nombre}` : `De ${otherUser.nombre}`}
                      </div>
                      <div className="text-[9px] text-white/15">{otherUser.salon}</div>
                    </div>
                  </div>
                  <span className={`text-[8px] font-bold ${sc.color} tracking-[0.15em]`}>{sc.text}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 text-center bg-white/[0.02] py-2.5">
                    <div className="text-[8px] text-white/15 mb-1 uppercase tracking-wider">{isMine ? 'Das' : 'Te da'}</div>
                    <div className="text-[11px] font-bold text-white/50">{trade.offerSticker.codigo}</div>
                    <div className="text-[7px] text-white/20 truncate px-1">{trade.offerSticker.nombreJugador}</div>
                  </div>
                  <svg className="w-4 h-4 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <div className="flex-1 text-center bg-white/[0.02] py-2.5">
                    <div className="text-[8px] text-white/15 mb-1 uppercase tracking-wider">{isMine ? 'Recibes' : 'Quiere'}</div>
                    <div className="text-[11px] font-bold text-white/50">{trade.requestSticker.codigo}</div>
                    <div className="text-[7px] text-white/20 truncate px-1">{trade.requestSticker.nombreJugador}</div>
                  </div>
                </div>

                {trade.status === 'pending' && !isMine && (
                  <div className="flex gap-[1px] mt-3">
                    <button onClick={() => handleAction(trade.id, 'accepted')}
                      className="flex-1 bg-white text-negro py-2.5 text-[9px] font-bold uppercase tracking-[0.1em] hover:bg-white/90 transition-colors active:scale-[0.98]">
                      ACEPTAR
                    </button>
                    <button onClick={() => handleAction(trade.id, 'rejected')}
                      className="flex-1 bg-white/[0.04] text-white/30 border border-white/[0.06] py-2.5 text-[9px] font-bold uppercase tracking-[0.1em] hover:bg-white/[0.06] transition-colors active:scale-[0.98]">
                      RECHAZAR
                    </button>
                  </div>
                )}

                {trade.status === 'pending' && isMine && (
                  <p className="text-center text-[9px] text-white/10 mt-3 tracking-[0.15em] uppercase">Esperando respuesta...</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
