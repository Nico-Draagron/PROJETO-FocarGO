import React from 'react';
import { ExtendedUserState } from '../types';
import { Card } from '../components/UI';
import { MILESTONES } from '../constants';

interface ImpactProps {
  userState: ExtendedUserState;
  milestones: typeof MILESTONES;
}

const Impact: React.FC<ImpactProps> = ({ userState, milestones }) => {
  
  // Calculate weekly stats (mock logic for demo)
  const itemsThisWeek = userState.history.length; 
  const ecoinsThisWeek = userState.history.reduce((acc, curr) => acc + curr.reward, 0);

  // Material Breakdown
  const totalItems = userState.itemsIdentified || 1; // avoid divide by zero
  const materials = [
    { key: 'plastic', label: 'Plástico', color: '#E74C3C', icon: '🔴', count: userState.materialCounts.plastic || 0 },
    { key: 'glass', label: 'Vidro', color: '#5FD45E', icon: '🟢', count: userState.materialCounts.glass || 0 },
    { key: 'metal', label: 'Metal', color: '#F39C12', icon: '🟡', count: userState.materialCounts.metal || 0 },
    { key: 'paper', label: 'Papel', color: '#3498DB', icon: '🔵', count: userState.materialCounts.paper || 0 },
  ].sort((a, b) => b.count - a.count);

  const shareImpact = () => {
    const msg = `🌍 Estou fazendo a diferença com EcoCoins!
📦 ${userState.itemsIdentified} itens identificados
💰 ${userState.balance} ecoins ganhos
🌱 ${userState.co2SavedTotal.toFixed(1)}kg CO₂ economizados
❤️ R$${userState.cooperativeIncomeTotal.toFixed(2)} para cooperativas`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="px-4 py-6 animate-fade-in pb-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-darkPurple mb-2">Seu Impacto</h2>
        <p className="text-brand-purple">Cada ação conta. Veja a diferença!</p>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-brand-teal to-brand-lightGreen rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📦</span>
            <div>
              <div className="text-4xl font-bold">{userState.itemsIdentified}</div>
              <div className="text-sm opacity-90">Itens Identificados</div>
              <div className="text-xs font-bold mt-1 opacity-75">+{itemsThisWeek} esta semana</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-purple to-brand-darkPurple rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <span className="text-4xl">💰</span>
            <div>
              <div className="text-4xl font-bold">{userState.balance}</div>
              <div className="text-sm opacity-90">Ecoins Ganhos</div>
              <div className="text-xs font-bold mt-1 opacity-75">+{ecoinsThisWeek} esta semana</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-lightGreen to-brand-teal rounded-2xl p-6 text-white shadow-lg">
           <div className="flex items-center gap-4">
            <span className="text-4xl">🌱</span>
            <div>
              <div className="text-3xl font-bold">{userState.co2SavedTotal.toFixed(1)}kg</div>
              <div className="text-sm opacity-90">CO₂ Economizado</div>
              <div className="text-xs font-bold mt-1 opacity-75">= {(userState.co2SavedTotal * 4).toFixed(0)}km não dirigidos</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-darkPurple to-brand-purple rounded-2xl p-6 text-white shadow-lg">
           <div className="flex items-center gap-4">
            <span className="text-4xl">❤️</span>
            <div>
              <div className="text-3xl font-bold">R$ {userState.cooperativeIncomeTotal.toFixed(2)}</div>
              <div className="text-sm opacity-90">Renda Cooperativas</div>
              <div className="text-xs font-bold mt-1 opacity-75">Impacto real em famílias</div>
            </div>
          </div>
        </div>
      </div>

      {/* Material Breakdown */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold text-brand-darkPurple mb-4">📊 Materiais Identificados</h2>
        <div className="space-y-4">
          {materials.map((mat) => {
            const pct = ((mat.count / totalItems) * 100).toFixed(1);
            return (
              <div key={mat.key} className="flex items-center gap-3">
                 <div className="w-24 text-sm font-bold text-brand-petrol flex items-center gap-1">
                   <span>{mat.icon}</span> {mat.label}
                 </div>
                 <div className="flex-1 h-3 bg-brand-beige rounded-full overflow-hidden">
                   <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: mat.color }}></div>
                 </div>
                 <div className="w-12 text-xs font-bold text-right">{pct}%</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Impact Story */}
      <div className="bg-gradient-to-br from-brand-purple to-brand-darkPurple rounded-2xl p-6 text-white shadow-lg mb-6">
         <div className="flex items-center gap-4 mb-4">
           <div className="text-5xl">🦭</div>
           <div>
             <h3 className="font-bold text-lg">João Silva</h3>
             <p className="text-sm opacity-80">Cooperativa Vila Mariana</p>
           </div>
         </div>
         <p className="italic opacity-90 mb-4 text-sm leading-relaxed">
           "Trabalho na cooperativa há 5 anos. Cada item que você separa corretamente ajuda a sustentar minha família de 4 pessoas. Obrigado!"
         </p>
         <div className="bg-white/10 rounded-lg p-3 text-sm">
           <strong>Seu impacto em João:</strong> R$ {userState.cooperativeIncomeTotal.toFixed(2)} gerados
         </div>
      </div>

      {/* Milestones */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold text-brand-darkPurple mb-4">🏆 Próximas Metas</h2>
        <div className="space-y-6">
          {milestones.map((m) => {
            const progress = Math.min((userState.itemsIdentified / m.target) * 100, 100);
            const isCompleted = userState.itemsIdentified >= m.target;
            
            return (
              <div key={m.id}>
                <div className="flex items-center gap-3 mb-2">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${isCompleted ? 'bg-brand-teal text-white' : 'bg-brand-beige text-gray-400'}`}>
                     {isCompleted ? '👑' : '🌱'}
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between">
                       <h4 className="font-bold text-brand-darkPurple text-sm">{m.title}</h4>
                       <span className="text-xs font-bold text-brand-teal">{userState.itemsIdentified}/{m.target}</span>
                     </div>
                     <p className="text-xs text-brand-petrol">{m.description}</p>
                   </div>
                </div>
                <div className="h-2 bg-brand-beige rounded-full overflow-hidden ml-13">
                  <div className="h-full bg-brand-teal transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <button onClick={shareImpact} className="w-full py-4 bg-brand-teal text-white font-bold rounded-xl shadow-lg shadow-brand-teal/30 active:scale-95 transition-transform">
        Compartilhar Impacto 📤
      </button>

    </div>
  );
};

export default Impact;