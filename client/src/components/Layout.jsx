import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import QRCodeModal from './QRCode';

const tabs = [
  { to: '/album', label: 'ALBUM', icon: AlbumIcon },
  { to: '/buscar', label: 'BUSCAR', icon: SearchIcon },
  { to: '/cambios', label: 'CAMBIOS', icon: TradeIcon },
  { to: '/chat', label: 'CHAT', icon: ChatIcon },
];

export default function Layout() {
  const { user, logout } = useUser();
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-negro text-white px-4 py-3 flex items-center justify-between
                         sticky top-0 z-40 relative">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚽</span>
          <div>
            <h1 className="text-base text-dorado tracking-wider leading-none">PEGAGOL</h1>
            <span className="text-[7px] text-white/20 tracking-[0.25em] uppercase">MUNDIAL 2026</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQR(true)}
            className="w-8 h-8 bg-white/5 rounded-sm flex items-center justify-center
                       text-xs hover:bg-white/10 transition-colors"
            title="Codigo QR"
          >
            📱
          </button>
          <div className="text-right">
            <div className="text-xs font-bold text-white/80">{user?.nombre}</div>
            <div className="text-[9px] text-white/30">{user?.salon}</div>
          </div>
          <button
            onClick={logout}
            className="w-8 h-8 bg-white/5 rounded-sm flex items-center justify-center
                       text-xs hover:bg-white/10 transition-colors"
            title="Salir"
          >
            👋
          </button>
        </div>
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-dorado/60 to-transparent" />
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>

      {/* Tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-negro border-t
                      border-white/5 z-40">
        <div className="flex">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2.5 transition-colors relative
                 ${isActive ? 'text-dorado' : 'text-white/25 hover:text-white/40'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-dorado" />
                  )}
                  <Icon />
                  <span className="text-[9px] mt-0.5 font-bold tracking-wider">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
      {showQR && <QRCodeModal onClose={() => setShowQR(false)} />}
    </div>
  );
}

function AlbumIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function TradeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
