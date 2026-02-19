import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import QRCodeModal from './QRCode';

const tabs = [
  { to: '/album', label: 'ALBUM', icon: AlbumIcon },
  { to: '/buscar', label: 'BUSCAR', icon: SearchIcon },
  { to: '/mundial', label: 'MUNDIAL', icon: MundialIcon },
  { to: '/cambios', label: 'CAMBIOS', icon: TradeIcon },
  { to: '/chat', label: 'CHAT', icon: ChatIcon },
];

export default function Layout() {
  const { user, logout } = useUser();
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl">
      {/* Header - Adidas editorial style */}
      <header className="bg-negro px-5 py-4 flex items-center justify-between
                         sticky top-0 z-40 relative brand-bar">
        {/* Logo - Editorial Bold */}
        <div className="flex items-center gap-3">
          {/* Three stripes mark */}
          <div className="flex flex-col gap-[2px]">
            <div className="w-5 h-[3px] bg-[#00c853]" />
            <div className="w-4 h-[3px] bg-[#2196f3]" />
            <div className="w-3 h-[3px] bg-[#f44336]" />
          </div>
          <div>
            <h1 className="logo-editorial text-[22px] text-white leading-none tracking-[0.1em]">
              PEGAGOL
            </h1>
            <span className="text-[7px] text-white/15 tracking-[0.35em] uppercase font-medium block mt-[1px]">
              WORLD CUP 2026
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowQR(true)}
            className="w-8 h-8 border border-white/10 flex items-center justify-center
                       hover:border-white/25 transition-colors"
            title="Codigo QR"
          >
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75H16.5v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75H16.5v-.75z" />
            </svg>
          </button>
          <div className="text-right">
            <div className="text-[11px] font-semibold text-white/70 tracking-wide">{user?.nombre}</div>
            <div className="text-[8px] text-white/20 tracking-wider">{user?.salon}</div>
          </div>
          <button
            onClick={logout}
            className="w-8 h-8 border border-white/10 flex items-center justify-center
                       hover:border-white/25 transition-colors group"
            title="Salir"
          >
            <svg className="w-3.5 h-3.5 text-white/30 group-hover:text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>

      {/* Tab bar - Clean Adidas style */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-negro z-40
                      border-t border-white/[0.06]">
        <div className="flex">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-3 transition-all relative
                 ${isActive ? 'text-white' : 'text-white/20 hover:text-white/35'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-white" />
                  )}
                  <Icon active={isActive} />
                  <span className={`text-[8px] mt-1 tracking-[0.15em] ${
                    isActive ? 'font-bold' : 'font-medium'
                  }`}>{label}</span>
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

function AlbumIcon({ active }) {
  return (
    <svg className={`w-[18px] h-[18px] ${active ? 'stroke-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function SearchIcon({ active }) {
  return (
    <svg className={`w-[18px] h-[18px] ${active ? 'stroke-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function TradeIcon({ active }) {
  return (
    <svg className={`w-[18px] h-[18px] ${active ? 'stroke-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

function MundialIcon({ active }) {
  return (
    <svg className={`w-[18px] h-[18px] ${active ? 'stroke-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5}
            d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3c2.5 2.8 4 6.2 4 9s-1.5 6.2-4 9c-2.5-2.8-4-6.2-4-9s1.5-6.2 4-9z" />
    </svg>
  );
}

function ChatIcon({ active }) {
  return (
    <svg className={`w-[18px] h-[18px] ${active ? 'stroke-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
