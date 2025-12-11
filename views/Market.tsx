import React from 'react';
import { ExtendedUserState } from '../types';

interface MarketProps {
  userState: ExtendedUserState;
}

const Market: React.FC<MarketProps> = ({ userState }) => {
  return (
    <div className="p-4 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-darkPurple">Loja FocarGo</h2>
        <p className="text-brand-petrol">Troque ecoins por recompensas incríveis</p>
      </div>

      <div className="bg-brand-teal text-white p-6 rounded-2xl shadow-lg mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">Seu Saldo</p>
          <h3 className="text-3xl font-bold">{userState.balance} ecoins</h3>
        </div>
        <div className="text-4xl">💰</div>
      </div>

      <h3 className="font-bold text-brand-darkPurple text-lg mb-4">Destaques</h3>
      <div className="grid gap-4">
        {[
          { title: 'Cupom iFood R$10', cost: 200, icon: '🍔', color: 'bg-red-100 text-red-600' },
          { title: 'Kit Canudos Inox', cost: 500, icon: '🥤', color: 'bg-gray-200 text-gray-700' },
          { title: 'Doação para ONG', cost: 100, icon: '❤️', color: 'bg-pink-100 text-pink-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-brand-petrol">{item.title}</h4>
                <p className="text-sm text-brand-teal font-bold">{item.cost} ecoins</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-brand-darkPurple text-white rounded-lg text-sm font-bold">
              Resgatar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Market;