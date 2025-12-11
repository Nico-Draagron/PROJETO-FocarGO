import React from 'react';

const Social: React.FC = () => {
  return (
    <div className="p-4 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-darkPurple">Comunidade</h2>
        <p className="text-brand-petrol">Veja o que outros EcoWarriors estão fazendo</p>
      </div>

      <div className="space-y-4">
        {[
          { user: 'Maria Silva', action: 'Reciclou 15 garrafas PET', time: '2 min atrás', likes: 12 },
          { user: 'João Souza', action: 'Completou o Desafio Semanal', time: '1 hora atrás', likes: 45 },
          { user: 'Ana Costa', action: 'Plantou uma árvore', time: '3 horas atrás', likes: 89 },
        ].map((post, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-brand-beige rounded-full flex items-center justify-center font-bold text-brand-darkPurple">
                {post.user.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-brand-petrol text-sm">{post.user}</h4>
                <p className="text-xs text-gray-400">{post.time}</p>
              </div>
            </div>
            <p className="text-brand-petrol mb-3">{post.action}</p>
            <div className="flex gap-4 text-sm text-gray-500 font-medium">
              <span>❤️ {post.likes}</span>
              <span>💬 Comentar</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Social;