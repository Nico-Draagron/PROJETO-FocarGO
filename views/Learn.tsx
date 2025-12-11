import React from 'react';

const Learn: React.FC = () => {
  return (
    <div className="p-4 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-darkPurple">Aprender</h2>
        <p className="text-brand-petrol">Jogos educativos para masterizar a reciclagem</p>
      </div>

      <div className="grid gap-4">
        <div className="bg-gradient-to-r from-brand-teal to-brand-lightGreen p-6 rounded-2xl text-white shadow-lg">
          <h3 className="text-xl font-bold mb-2">Desafio Diário</h3>
          <p className="opacity-90 mb-4 text-sm">Responda 5 perguntas e ganhe 50 ecoins!</p>
          <button className="bg-white text-brand-teal px-6 py-2 rounded-lg font-bold">Jogar Agora</button>
        </div>

        <h3 className="font-bold text-brand-darkPurple mt-4">Trilhas de Conhecimento</h3>
        {[
          { title: 'Plástico 101', progress: 80, color: 'bg-red-500' },
          { title: 'Metais Infinitos', progress: 30, color: 'bg-yellow-500' },
          { title: 'Vidro & Segurança', progress: 0, color: 'bg-green-500' },
        ].map((track, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${track.color} text-white flex items-center justify-center font-bold`}>
              {i + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-brand-petrol">{track.title}</h4>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className={`h-full ${track.color}`} style={{ width: `${track.progress}%` }}></div>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-500">{track.progress}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;