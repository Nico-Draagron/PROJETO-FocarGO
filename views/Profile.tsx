import React from 'react';
import { Card } from '../components/UI';
import { ExtendedUserState } from '../types';

interface ProfileProps {
  userState: ExtendedUserState;
}

export const Profile: React.FC<ProfileProps> = ({ userState }) => {
  return (
    <div className="px-4 py-8 flex flex-col gap-6 animate-fade-in pb-24">
      
      {/* Header */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-brand-teal flex items-center justify-center text-4xl border-4 border-white shadow-xl mb-4 relative">
          👤
          <div className="absolute bottom-0 right-0 bg-brand-purple w-8 h-8 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
            Lv.3
          </div>
        </div>
        <h2 className="text-2xl font-bold text-brand-darkPurple">Eco Warrior</h2>
        <p className="text-brand-petrol">Membro desde Out 2023</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white p-3 rounded-xl shadow-sm">
           <div className="text-2xl mb-1">🔥</div>
           <div className="font-bold text-brand-darkPurple">{userState.itemsIdentified}</div>
           <div className="text-[10px] text-gray-500 uppercase">Itens</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm">
           <div className="text-2xl mb-1">🧠</div>
           <div className="font-bold text-brand-darkPurple">{userState.quizStats.correct}</div>
           <div className="text-[10px] text-gray-500 uppercase">Quiz OK</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm">
           <div className="text-2xl mb-1">🌍</div>
           <div className="font-bold text-brand-darkPurple">{userState.co2SavedTotal.toFixed(1)}</div>
           <div className="text-[10px] text-gray-500 uppercase">kg CO₂</div>
        </div>
      </div>

      {/* Menu */}
      <Card className="divide-y divide-gray-100">
        <button className="w-full py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-brand-teal/10 rounded-lg text-brand-teal">👤</span>
            <span className="font-semibold text-brand-petrol">Editar Perfil</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>
        
        <button className="w-full py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-brand-purple/10 rounded-lg text-brand-purple">🏆</span>
            <span className="font-semibold text-brand-petrol">Minhas Conquistas</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button className="w-full py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-100 rounded-lg text-blue-600">🔔</span>
            <span className="font-semibold text-brand-petrol">Notificações</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>

        <button className="w-full py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-gray-100 rounded-lg text-gray-600">⚙️</span>
            <span className="font-semibold text-brand-petrol">Configurações</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>
      </Card>

      <button className="text-red-500 font-semibold py-2">Sair da Conta</button>
    </div>
  );
};