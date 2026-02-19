import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { getMessages, sendMessage } from '../lib/api';

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

  // Poll for new messages (demo mode - no socket)
  useEffect(() => {
    const interval = setInterval(() => loadMessages(), 3000);
    return () => clearInterval(interval);
  }, [loadMessages]);

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
      <div className="flex items-center gap-3 px-5 py-3.5 bg-negro brand-bar">
        <button onClick={onBack} className="text-white/30 hover:text-white/50 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-8 h-8 bg-white/[0.04] flex items-center justify-center
                        text-white/30 font-bold text-[11px]">
          {otherUser.nombre[0]}
        </div>
        <div>
          <div className="font-semibold text-white/60 text-[11px] tracking-wide">{otherUser.nombre}</div>
          <div className="text-[8px] text-white/15 tracking-wider">{otherUser.salon}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 bg-negro">
        {messages.map((msg) => {
          const isMine = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-3.5 py-2.5 text-sm
                ${isMine
                  ? 'bg-white text-negro'
                  : 'bg-white/[0.04] border border-white/[0.06] text-white/60'
                }`}>
                <p className="text-[12px] leading-relaxed">{msg.content}</p>
                <p className={`text-[8px] mt-1 ${isMine ? 'text-negro/30' : 'text-white/15'}`}>
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
      <form onSubmit={handleSend} className="flex gap-2 px-5 py-3.5 bg-negro brand-bar">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-transparent border-b border-white/10 px-0 py-2 text-[12px]
                     text-white placeholder-white/15 focus:outline-none focus:border-white/30
                     transition-colors"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="bg-white text-negro w-9 h-9 flex items-center justify-center
                     hover:bg-white/90 disabled:opacity-20 transition-all active:scale-95"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
