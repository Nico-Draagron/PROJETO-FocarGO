import React from 'react';
import { AppView } from '../types';
import { APP_TITLE, TAGLINE } from '../constants';

// --- Header Component ---

interface HeaderProps {
  balance: number;
}

export const Header: React.FC<HeaderProps> = ({ balance }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-white/95 backdrop-blur-sm shadow-sm z-50 flex items-center justify-between px-4 transition-all duration-300">
      <div className="flex items-center gap-3">
        {/* Logo Image */}
        <div className="relative">
          <img 
            src="FocarGo.png" 
            alt={APP_TITLE}
            className="h-12 w-auto object-contain drop-shadow-sm"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.getElementById('header-logo-fallback');
              if (fallback) fallback.classList.remove('hidden');
              if (fallback) fallback.classList.add('flex');
            }}
          />
          
          {/* Fallback Icon */}
          <div id="header-logo-fallback" className="hidden w-10 h-10 bg-brand-teal rounded-full items-center justify-center text-2xl shadow-md border-2 border-brand-purple">
            🦭
          </div>
        </div>

        {/* Text Logo (Visible if image fails or just as brand name if image is just icon) */}
        <div className="flex flex-col justify-center">
          <h1 className="text-brand-darkPurple font-black text-xl tracking-tight leading-none">
            {APP_TITLE}
          </h1>
          <span className="text-[10px] text-brand-teal font-bold tracking-widest uppercase">{TAGLINE}</span>
        </div>
      </div>
      
      <div className="bg-brand-teal/10 px-3 py-1.5 rounded-xl border border-brand-teal/20 flex items-center gap-2 shadow-sm animate-fade-in">
        <span className="text-lg">💰</span>
        <span className="text-brand-teal font-bold text-sm">{balance}</span>
      </div>
    </header>
  );
};

// --- Bottom Navigation Component ---

interface BottomNavProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: AppView.HOME, label: 'Home', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { id: AppView.SCAN, label: 'Scan', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { id: AppView.MARKET, label: 'Loja', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    )},
    { id: AppView.LEARN, label: 'Jogos', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { id: AppView.PROFILE, label: 'Perfil', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )}
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[64px] bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center pb-safe border-t border-gray-50">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
              isActive ? 'text-brand-teal' : 'text-gray-400 hover:text-brand-petrol'
            }`}
          >
            <div className={`transform transition-transform duration-200 ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[10px] font-medium mt-0.5 transition-opacity ${isActive ? 'opacity-100 font-bold' : 'opacity-80'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};