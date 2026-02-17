import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { getMessages, sendMessage } from '../lib/api';
import socket from '../lib/socket';

export default function ChatRoom({ otherUser, onBack }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadMessages = useCallback(async () => {
    try {
      const data = await getMessages(user.id, otherUser.id);
      setMessages(data);
    } catch {
      console.error('Error cargando mensajes');
    }
  }, [user.id, otherUser.id]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    const handler = (msg) => {
      if (msg.senderId === otherUser.id || msg.receiverId === otherUser.id) {
        loadMessages();
      }
    };
    socket.on('new_message', handler);
    return () => socket.off('new_message', handler);
  }, [otherUser.id, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage({
        senderId: user.id,
        receiverId: otherUser.id,
        content: text.trim(),
      });
      setText('');
      await loadMessages();
    } catch {
      alert('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-7rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-negro-light border-b border-white/5">
        <button onClick={onBack} className="text-white/40 hover:text-white/60">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-8 h-8 bg-white/5 rounded-sm flex items-center justify-center
                        text-white/50 font-bold text-xs">
          {otherUser.nombre[0]}
        </div>
        <div>
          <div className="font-bold text-white/70 text-xs uppercase">{otherUser.nombre}</div>
          <div className="text-[9px] text-white/20">Salon {otherUser.salon}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-negro">
        {messages.map((msg) => {
          const isMine = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-3 py-2 text-sm
                ${isMine
                  ? 'bg-verde text-white rounded-sm rounded-br-none'
                  : 'bg-negro-light border border-white/5 text-white/70 rounded-sm rounded-bl-none'
                }`}>
                <p className="text-xs">{msg.content}</p>
                <p className={`text-[9px] mt-1 ${isMine ? 'text-white/40' : 'text-white/20'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('es-MX', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 px-4 py-3 bg-negro-light border-t border-white/5">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-negro border border-white/10 rounded-sm px-4 py-2.5 text-sm
                     text-white placeholder-white/20 focus:outline-none focus:border-dorado"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="bg-dorado text-negro w-10 h-10 rounded-sm flex items-center justify-center
                     hover:bg-dorado-dark disabled:opacity-30 transition-colors active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
