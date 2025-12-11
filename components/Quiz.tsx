import React from 'react';
import { QuizData, QuizOption } from '../types';

// --- Quiz Invitation ---
interface QuizInvitationProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const QuizInvitation: React.FC<QuizInvitationProps> = ({ onAccept, onDecline }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-slide-up">
      <div className="text-5xl mb-4 animate-bounce">🎯</div>
      <h3 className="text-2xl font-bold text-brand-darkPurple mb-2">Quiz Time!</h3>
      <p className="text-brand-petrol mb-6">
        Você identificou vários itens! Que tal testar seu conhecimento e ganhar ecoins extras?
      </p>
      <div className="flex gap-3">
        <button 
          onClick={onAccept}
          className="flex-1 bg-brand-teal text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-teal/30 hover:brightness-110 transition-all"
        >
          Vamos lá! 💪
        </button>
        <button 
          onClick={onDecline}
          className="flex-1 bg-brand-beige text-brand-petrol font-bold py-3 rounded-xl hover:bg-brand-petrol/10 transition-all"
        >
          Agora não
        </button>
      </div>
    </div>
  </div>
);

// --- Quiz Modal ---
interface QuizModalProps {
  loading: boolean;
  quizData: QuizData | null;
  onClose: () => void;
  onAnswer: (optionId: string) => void;
  feedback: { isCorrect: boolean } | null;
}

export const QuizModal: React.FC<QuizModalProps> = ({ loading, quizData, onClose, onAnswer, feedback }) => {
  
  if (loading) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="font-bold text-lg">Gerando desafio personalizado...</p>
        </div>
      </div>
    );
  }

  if (!quizData) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-brand-darkPurple p-6 text-white flex justify-between items-start">
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block
              ${quizData.difficulty === 'beginner' ? 'bg-brand-lightGreen text-brand-petrol' : 
                quizData.difficulty === 'intermediate' ? 'bg-yellow-400 text-yellow-900' : 'bg-red-400 text-white'}`}>
              {quizData.difficulty}
            </span>
            <h2 className="text-xl font-bold leading-tight">{quizData.question}</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Scenario */}
          <div className="bg-brand-beige rounded-xl p-4 mb-6 flex gap-4 items-center">
             <div className="text-4xl">🤔</div>
             <p className="text-sm text-brand-petrol italic">{quizData.scenario_description}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {quizData.options.map((opt) => {
               // Determine styling based on feedback
               let btnClass = "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3 ";
               let disabled = !!feedback;

               if (feedback) {
                 if (opt.id === quizData.correct_answer_id) {
                   btnClass += "bg-green-100 border-green-500 text-green-800";
                 } else if (opt.id !== quizData.correct_answer_id && feedback.isCorrect === false && opt.id === (document.activeElement as HTMLElement)?.dataset?.id) { 
                   // This logic is tricky in React without tracking selected ID. 
                   // Simplified: Highlight correct, dim others.
                   btnClass += "opacity-50 border-gray-200";
                 } else {
                   btnClass += "opacity-50 border-gray-200";
                 }
               } else {
                 btnClass += "bg-white border-gray-200 hover:border-brand-teal hover:bg-brand-teal/5";
               }

               return (
                 <button 
                  key={opt.id} 
                  disabled={disabled}
                  onClick={() => onAnswer(opt.id)}
                  className={btnClass}
                 >
                   <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                     ${feedback && opt.id === quizData.correct_answer_id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                     {opt.id}
                   </span>
                   <span className="font-medium">{opt.text}</span>
                 </button>
               )
            })}
          </div>

          {/* Feedback Section */}
          {feedback && (
            <div className={`rounded-xl p-5 mb-4 animate-fade-in text-center ${feedback.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="text-4xl mb-2">{feedback.isCorrect ? '🎉' : '😅'}</div>
              <h3 className={`font-bold text-lg mb-2 ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {feedback.isCorrect ? 'Resposta Correta!' : 'Não foi dessa vez...'}
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                {feedback.isCorrect ? quizData.explanation_correct : quizData.explanation_incorrect}
              </p>
              
              <div className="bg-white/60 rounded-lg p-3 text-sm text-left mb-4">
                <strong className="block text-brand-purple text-xs uppercase mb-1">💡 Ponto Chave:</strong>
                {quizData.learning_point}
              </div>

              {feedback.isCorrect && (
                <div className="flex items-center justify-center gap-2 text-brand-teal font-bold text-lg bg-white rounded-lg py-2 shadow-sm">
                  <span>💰</span> +{quizData.ecoins_reward} ecoins
                </div>
              )}
            </div>
          )}

          {feedback && (
            <button 
              onClick={onClose}
              className="w-full bg-brand-darkPurple text-white font-bold py-3 rounded-xl shadow-lg"
            >
              Continuar
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export const QuizFeedback = () => null; // Placeholder if imported elsewhere