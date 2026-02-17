import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { getConversations } from '../lib/api';
import socket from '../lib/socket';
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

  useEffect(() => {
    socket.on('new_message', () => {
      if (!activeChat) loadConversations();
    });
    return () => socket.off('new_message');
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
        <div className="text-dorado text-sm animate-pulse uppercase tracking-wider">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <h2 className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3">CHAT</h2>

      {conversations.length === 0 ? (
        <div className="text-center text-white/20 mt-10">
          <p className="text-4xl mb-2">💬</p>
          <p className="text-xs uppercase tracking-wider">No tienes conversaciones</p>
          <p className="text-[10px] text-white/10 mt-1">Propone un intercambio para iniciar un chat</p>
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.user.id}
              onClick={() => setActiveChat(conv.user)}
              className="w-full flex items-center gap-3 bg-negro-light border border-white/5 rounded-sm p-3
                         hover:bg-white/[0.03] transition-colors text-left"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-white/5 rounded-sm flex items-center justify-center
                                text-white/50 font-bold text-sm">
                  {conv.user.nombre[0]}
                </div>
                {conv.unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-dorado text-negro text-[9px]
                                   font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-white/70 text-xs uppercase">{conv.user.nombre}</span>
                  <span className="text-[9px] text-white/20">
                    {formatTime(conv.lastMessage.createdAt)}
                  </span>
                </div>
                <p className="text-[10px] text-white/30 truncate">
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
