import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { getConversations } from '../lib/api';
import ChatRoom from '../components/ChatRoom';

export default function Chat() {
  const { user } = useUser();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getConversations(user.id);
      setConversations(data);
    } catch {
      console.error('Error cargando conversaciones');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Poll for new messages (demo mode - no socket)
  useEffect(() => {
    if (activeChat) return;
    const interval = setInterval(() => loadConversations(), 5000);
    return () => clearInterval(interval);
  }, [activeChat, loadConversations]);

  if (activeChat) {
    return (
      <ChatRoom
        otherUser={activeChat}
        onBack={() => {
          setActiveChat(null);
          loadConversations();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/20 text-[11px] animate-pulse uppercase tracking-[0.2em]">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-5 pb-4">
      <h2 className="font-display text-[28px] text-white leading-none tracking-wide mb-1">CHAT</h2>
      <p className="text-[9px] text-white/15 tracking-[0.2em] uppercase mb-5">Mensajes con tus compas</p>

      {conversations.length === 0 ? (
        <div className="text-center mt-16">
          <div className="w-12 h-12 border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-[10px] text-white/15 tracking-[0.15em] uppercase">No hay conversaciones</p>
          <p className="text-[8px] text-white/10 mt-1 tracking-wider">Propone un intercambio para chatear</p>
        </div>
      ) : (
        <div className="space-y-[1px]">
          {conversations.map((conv) => (
            <button
              key={conv.user.id}
              onClick={() => setActiveChat(conv.user)}
              className="w-full flex items-center gap-3 card-adidas p-3.5 text-left"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-white/[0.04] flex items-center justify-center
                                text-white/30 font-bold text-[12px]">
                  {conv.user.nombre[0]}
                </div>
                {conv.unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-negro text-[8px]
                                   font-bold w-4 h-4 flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-white/60 text-[11px] tracking-wide">{conv.user.nombre}</span>
                  <span className="text-[8px] text-white/15">{formatTime(conv.lastMessage.createdAt)}</span>
                </div>
                <p className="text-[10px] text-white/20 truncate mt-0.5">
                  {conv.lastMessage.senderId === user.id ? 'Tu: ' : ''}
                  {conv.lastMessage.content}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(date) {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Ayer';
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}
