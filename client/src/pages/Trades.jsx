import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { getUserTrades, updateTrade } from '../lib/api';
import socket from '../lib/socket';

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

  useEffect(() => {
    socket.on('trade_notification', () => loadTrades());
    return () => socket.off('trade_notification');
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
        <div className="text-dorado text-sm animate-pulse uppercase tracking-wider">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <h2 className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3">INTERCAMBIOS</h2>

      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: 'TODOS' },
          { key: 'pending', label: 'PENDIENTES' },
          { key: 'completed', label: 'RESUELTOS' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-sm text-[10px] font-bold transition-colors uppercase tracking-wider
              ${filter === key
                ? 'bg-dorado text-negro'
                : 'bg-white/5 text-white/30 hover:bg-white/10'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-white/20 mt-10">
          <p className="text-4xl mb-2">🔄</p>
          <p className="text-xs uppercase tracking-wider">No hay intercambios todavia</p>
          <p className="text-[10px] text-white/10 mt-1">Busca estampas y propone cambios</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((trade) => {
            const isMine = trade.fromUserId === user.id;
            const otherUser = isMine ? trade.toUser : trade.fromUser;
            const sc = {
              pending: { bg: 'bg-negro-light', border: 'border-dorado/20', text: 'PENDIENTE', color: 'text-dorado' },
              accepted: { bg: 'bg-negro-light', border: 'border-verde/20', text: 'ACEPTADO', color: 'text-verde' },
              rejected: { bg: 'bg-negro-light', border: 'border-red-500/20', text: 'RECHAZADO', color: 'text-red-400' },
            }[trade.status];

            return (
              <div key={trade.id} className={`${sc.bg} border ${sc.border} rounded-sm p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/5 rounded-sm flex items-center justify-center
                                    text-white/50 text-xs font-bold">
                      {otherUser.nombre[0]}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white/70 uppercase">
                        {isMine ? `Para ${otherUser.nombre}` : `De ${otherUser.nombre}`}
                      </div>
                      <div className="text-[10px] text-white/20">Salon {otherUser.salon}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold ${sc.color} uppercase tracking-wider`}>{sc.text}</span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="flex-1 text-center bg-white/[0.03] rounded-sm p-2">
                    <div className="text-[9px] text-white/20 mb-1 uppercase">
                      {isMine ? 'Tu das' : 'Te da'}
                    </div>
                    <div className="text-[10px] font-bold text-dorado">{trade.offerSticker.codigo}</div>
                    <div className="text-[8px] text-white/30 truncate">{trade.offerSticker.nombreJugador}</div>
                  </div>

                  <span className="text-dorado text-sm">⇄</span>

                  <div className="flex-1 text-center bg-white/[0.03] rounded-sm p-2">
                    <div className="text-[9px] text-white/20 mb-1 uppercase">
                      {isMine ? 'Recibes' : 'Quiere'}
                    </div>
                    <div className="text-[10px] font-bold text-dorado">{trade.requestSticker.codigo}</div>
                    <div className="text-[8px] text-white/30 truncate">{trade.requestSticker.nombreJugador}</div>
                  </div>
                </div>

                {trade.status === 'pending' && !isMine && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAction(trade.id, 'accepted')}
                      className="flex-1 bg-verde text-white py-2 rounded-sm text-[10px] font-bold
                                 uppercase tracking-wider hover:bg-verde-dark transition-colors active:scale-[0.98]"
                    >
                      ACEPTAR
                    </button>
                    <button
                      onClick={() => handleAction(trade.id, 'rejected')}
                      className="flex-1 bg-white/5 text-red-400 border border-red-500/20 py-2 rounded-sm
                                 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/10
                                 transition-colors active:scale-[0.98]"
                    >
                      RECHAZAR
                    </button>
                  </div>
                )}

                {trade.status === 'pending' && isMine && (
                  <p className="text-center text-[10px] text-white/15 mt-3 uppercase tracking-wider">
                    Esperando respuesta...
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
