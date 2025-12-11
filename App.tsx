import React, { useState, useEffect } from 'react';
import { AppView, ExtendedUserState } from './types';
import { MOCK_HISTORY, MILESTONES } from './constants';
import { Header, BottomNav } from './components/LayoutParts';
import { GoogleGenAI } from "@google/genai";
import Home from './views/Home';
import Scan from './views/Scan';
import Impact from './views/Impact';
import MapLocator from './views/MapLocator';
import { Profile } from './views/Profile';
import Market from './views/Market';
import Social from './views/Social';
import Learn from './views/Learn';
import { QuizInvitation, QuizModal } from './components/Quiz';
import { QUIZ_GENERATION_PROMPT } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  
  // App State - Using ExtendedUserState for Phase 3
  const [userState, setUserState] = useState<ExtendedUserState>({
    balance: 150,
    itemsIdentified: 12,
    co2Saved: 3.5,
    history: MOCK_HISTORY,
    // Phase 3 Extensions
    materialCounts: { plastic: 5, metal: 3, glass: 2, paper: 2 },
    co2SavedTotal: 3.5,
    cooperativeIncomeTotal: 15.50,
    quizHistory: [],
    quizStats: {
      answered: 0,
      correct: 0,
      incorrect: 0,
      weakMaterials: []
    }
  });

  // Quiz State
  const [showQuizInvite, setShowQuizInvite] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean } | null>(null);

  // Check for Quiz Trigger (Every 3 items identified)
  useEffect(() => {
    if (userState.itemsIdentified > 0 && userState.itemsIdentified % 3 === 0) {
      const timer = setTimeout(() => {
        if (!currentQuiz && !showQuizInvite) {
           setShowQuizInvite(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userState.itemsIdentified]);

  const handleReward = (amount: number, materialName: string, category: string = 'other') => {
    let materialKey = 'other';
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('plást') || lowerCat.includes('plast')) materialKey = 'plastic';
    else if (lowerCat.includes('vidro') || lowerCat.includes('glass')) materialKey = 'glass';
    else if (lowerCat.includes('metal') || lowerCat.includes('alum')) materialKey = 'metal';
    else if (lowerCat.includes('papel') || lowerCat.includes('paper')) materialKey = 'paper';

    setUserState(prev => {
      const co2Delta = 0.15; 
      const incomeDelta = 0.35;

      return {
        ...prev,
        balance: prev.balance + amount,
        itemsIdentified: prev.itemsIdentified + 1,
        co2Saved: parseFloat((prev.co2Saved + co2Delta).toFixed(2)),
        co2SavedTotal: parseFloat((prev.co2SavedTotal + co2Delta).toFixed(2)),
        cooperativeIncomeTotal: parseFloat((prev.cooperativeIncomeTotal + incomeDelta).toFixed(2)),
        materialCounts: {
          ...prev.materialCounts,
          [materialKey]: (prev.materialCounts[materialKey] || 0) + 1
        },
        history: [
          {
            id: Date.now().toString(),
            icon: '✨',
            text: materialName,
            reward: amount,
            timestamp: 'Agora mesmo'
          },
          ...prev.history
        ]
      };
    });
  };

  // --- QUIZ LOGIC ---
  const generateQuiz = async () => {
    setIsGeneratingQuiz(true);
    setShowQuizInvite(false);

    try {
      const userLevel = userState.itemsIdentified <= 10 ? 'beginner' : userState.itemsIdentified <= 30 ? 'intermediate' : 'advanced';
      const weakMaterials = userState.quizStats.weakMaterials.slice(0, 3).join(', ');
      
      const prompt = QUIZ_GENERATION_PROMPT
        .replace('{userLevel}', userLevel)
        .replace('{weakMaterials}', weakMaterials || 'nenhum ainda')
        .replace('{strongMaterials}', 'plástico, metal') 
        .replace('{itemCount}', userState.itemsIdentified.toString());

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error("Empty response");
      
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const quizData = JSON.parse(cleanedText);

      setCurrentQuiz(quizData);

    } catch (error) {
      console.error("Quiz Gen Error:", error);
      alert("Não foi possível gerar o quiz agora.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleQuizAnswer = (optionId: string) => {
    if (!currentQuiz) return;
    
    const isCorrect = optionId === currentQuiz.correct_answer_id;
    setQuizFeedback({ isCorrect });
    
    setUserState(prev => ({
      ...prev,
      balance: isCorrect ? prev.balance + currentQuiz.ecoins_reward : prev.balance,
      quizStats: {
        ...prev.quizStats,
        answered: prev.quizStats.answered + 1,
        correct: isCorrect ? prev.quizStats.correct + 1 : prev.quizStats.correct,
        incorrect: !isCorrect ? prev.quizStats.incorrect + 1 : prev.quizStats.incorrect,
        weakMaterials: !isCorrect 
          ? [...prev.quizStats.weakMaterials, currentQuiz.material_category] 
          : prev.quizStats.weakMaterials
      },
      quizHistory: [
        ...prev.quizHistory,
        {
          question: currentQuiz.question,
          correct: isCorrect,
          material: currentQuiz.material_category,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  const closeQuiz = () => {
    setCurrentQuiz(null);
    setQuizFeedback(null);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <Home userState={userState} onNavigate={setCurrentView} />;
      case AppView.SCAN:
        return <Scan onReward={handleReward} />;
      case AppView.MAP:
        return <MapLocator />;
      case AppView.IMPACT:
        return <Impact userState={userState} milestones={MILESTONES} />;
      case AppView.PROFILE:
        return <Profile userState={userState} />;
      case AppView.MARKET:
        return <Market userState={userState} />;
      case AppView.SOCIAL:
        return <Social />;
      case AppView.LEARN:
        return <Learn />;
      default:
        return <Home userState={userState} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige font-sans text-brand-petrol selection:bg-brand-teal selection:text-white">
      <Header balance={userState.balance} />
      
      <main className="pt-[70px] pb-[80px] min-h-screen max-w-2xl mx-auto">
        {renderView()}
      </main>

      {/* Global Quiz Components */}
      {showQuizInvite && (
        <QuizInvitation 
          onAccept={generateQuiz} 
          onDecline={() => setShowQuizInvite(false)} 
        />
      )}

      {(isGeneratingQuiz || currentQuiz) && (
        <QuizModal 
          loading={isGeneratingQuiz}
          quizData={currentQuiz}
          onClose={closeQuiz}
          onAnswer={handleQuizAnswer}
          feedback={quizFeedback}
        />
      )}

      <BottomNav 
        currentView={currentView} 
        onChangeView={setCurrentView} 
      />
    </div>
  );
};

export default App;