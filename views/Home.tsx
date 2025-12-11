import React from 'react';
import { UserState, AppView } from '../types';
import { Button, Card, StatCard } from '../components/UI';

interface HomeProps {
  userState: UserState;
  onNavigate: (view: AppView) => void;
}

// Logo Component for Hero
const FocarGoHeroLogo = () => (
  <div className="flex flex-col items-center mb-6 animate-slide-up">
    {/* Primary Logo Image */}
    <img 
      src="FocarGo.png" 
      alt="FocarGo Logo" 
      className="w-48 h-auto object-contain drop-shadow-lg mb-2 hover:scale-105 transition-transform duration-300"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        const fallback = document.getElementById('hero-logo-fallback');
        if (fallback) fallback.classList.remove('hidden');
        if (fallback) fallback.classList.add('flex');
      }}
    />
    
    {/* Fallback if image fails */}
    <div id="hero-logo-fallback" className="hidden flex-col items-center">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-brand-purple shadow-[0_0_20px_rgba(122,62,177,0.3)] mb-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-teal opacity-10"></div>
        <span className="text-6xl relative z-10 drop-shadow-sm">🦭</span>
        <div className="absolute bottom-0 w-full h-2 bg-brand-purple"></div>
      </div>
      <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
        Focar<span className="text-brand-purple bg-white px-1 rounded-md ml-1">Go</span>
      </h1>
    </div>

    <p className="text-white/90 text-sm font-medium tracking-widest uppercase mt-2 bg-black/10 px-3 py-1 rounded-full backdrop-blur-sm">
      Recicle • Jogue • Ganhe
    </p>
  </div>
);

const ActionButton: React.FC<{ 
  title: string; 
  icon: string; 
  desc: string; 
  color: string; 
  onClick: () => void;
  badge?: string;
}> = ({ title, icon, desc, color, onClick, badge }) => (
  <button 
    onClick={onClick}
    className="relative flex flex-col items-start p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-left w-full border border-gray-100 group"
  >
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl mb-3 shadow-inner group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="font-bold text-brand-darkPurple text-lg">{title}</div>
    <div className="text-xs text-gray-500 font-medium">{desc}</div>
    
    {badge && (
      <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
        {badge}
      </div>
    )}
  </button>
);

const Home: React.FC<HomeProps> = ({ userState, onNavigate }) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-b-[40px] -mx-4 px-6 pt-8 pb-12 bg-gradient-to-br from-brand-teal via-[#0B7A5A] to-brand-lightGreen shadow-2xl">
        {/* Background Decor */}
        <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[200%] bg-white/5 rotate-12 rounded-[100px] pointer-events-none"></div>
        <div className="absolute top-10 right-10 text-9xl opacity-10 rotate-12 pointer-events-none">🌿</div>
        <div className="absolute bottom-10 left-[-20px] text-8xl opacity-10 -rotate-12 pointer-events-none">♻️</div>
        
        <div className="relative z-10 flex flex-col items-center">
          <FocarGoHeroLogo />
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-full max-w-sm border border-white/20 text-white text-center mb-6 shadow-lg">
             <div className="flex justify-between items-center px-4">
               <div className="text-left">
                 <p className="text-xs font-medium opacity-80 uppercase tracking-wide">Seu Saldo</p>
                 <div className="text-3xl font-bold flex items-center gap-2">
                   <span>💰</span> {userState.balance}
                 </div>
               </div>
               <div className="h-8 w-px bg-white/20"></div>
               <div className="text-right">
                  <p className="text-xs font-medium opacity-80 uppercase tracking-wide">Nível</p>
                  <div className="text-xl font-bold flex items-center gap-1 justify-end">
                    Lv. 3 <span className="text-xs bg-brand-purple px-1.5 py-0.5 rounded ml-1">Warrior</span>
                  </div>
               </div>
             </div>
          </div>

          <Button 
            variant="secondary" 
            onClick={() => onNavigate(AppView.SCAN)}
            className="bg-white text-brand-teal border-2 border-brand-teal hover:bg-brand-beige shadow-xl w-full max-w-xs flex items-center justify-center gap-2 py-4 text-lg font-bold transform hover:scale-105 transition-all"
          >
            <span className="text-2xl">📷</span>
            Identificar Resíduo
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-3 gap-3 px-4 -mt-10 relative z-20">
        <StatCard 
          icon="📦" 
          value={userState.itemsIdentified} 
          label="Itens" 
        />
        <StatCard 
          icon="🔥" 
          value="3" 
          label="Dias Streak" 
        />
        <StatCard 
          icon="🌱" 
          value={`${userState.co2Saved}kg`} 
          label="CO₂" 
        />
      </div>

      {/* Quick Actions Grid (New Features) */}
      <div className="px-4 mt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-brand-darkPurple flex items-center gap-2">
            <span>🚀</span> Explorar
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <ActionButton 
            title="Loja" 
            desc="Resgate prêmios" 
            icon="🛍️" 
            color="bg-purple-100 text-purple-600"
            onClick={() => onNavigate(AppView.MARKET)}
            badge="Novo!"
          />
          <ActionButton 
            title="Jogos" 
            desc="Aprenda jogando" 
            icon="🎮" 
            color="bg-blue-100 text-blue-600"
            onClick={() => onNavigate(AppView.LEARN)}
            badge="XP Em Dobro"
          />
          <ActionButton 
            title="Desafios" 
            desc="Comunidade" 
            icon="🏆" 
            color="bg-yellow-100 text-yellow-600"
            onClick={() => onNavigate(AppView.SOCIAL)}
          />
          <ActionButton 
            title="Mapa" 
            desc="Onde descartar" 
            icon="🗺️" 
            color="bg-green-100 text-green-600"
            onClick={() => onNavigate(AppView.MAP)}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-brand-darkPurple">Atividade Recente</h2>
          <button className="text-brand-teal text-sm font-bold hover:underline">Ver histórico</button>
        </div>
        
        <div className="flex flex-col gap-3">
          {userState.history.slice(0, 3).map((activity) => (
            <Card key={activity.id} className="flex items-center justify-between py-3 px-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-beige flex items-center justify-center text-xl shadow-inner">
                  {activity.icon}
                </div>
                <div>
                  <div className="font-semibold text-brand-petrol text-sm">{activity.text}</div>
                  <div className="text-xs text-gray-400 font-medium">{activity.timestamp}</div>
                </div>
              </div>
              <div className="font-bold text-brand-teal bg-brand-teal/5 px-2 py-1 rounded-lg text-xs border border-brand-teal/10">
                +{activity.reward} ecoins
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;