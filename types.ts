export enum AppView {
  HOME = 'home',
  SCAN = 'scan',
  MAP = 'map',
  IMPACT = 'impact',
  PROFILE = 'profile',
  MARKET = 'market',
  SOCIAL = 'social',
  LEARN = 'learn'
}

export interface StatItem {
  icon: string;
  value: string | number;
  label: string;
}

export interface ActivityItem {
  id: string;
  icon: string;
  text: string;
  reward: number;
  timestamp: string;
}

export interface UserState {
  balance: number;
  itemsIdentified: number;
  co2Saved: number;
  history: ActivityItem[];
}

export interface EnvironmentalImpact {
  co2_saved_kg: string;
  energy_saved: string;
  recycling_time: string;
  water_saved: string | null;
}

export interface AnalysisResult {
  material: string;
  material_details: string;
  category: string;
  bin_color: string;
  bin_emoji: string;
  recyclable: boolean;
  contamination_detected: boolean;
  contamination_details: string | null;
  cleaning_required: boolean;
  cleaning_instructions: string | null;
  educational_explanation: string;
  scientific_fact: string;
  environmental_impact: EnvironmentalImpact;
  journey_story: string;
  cooperative_impact: string;
  ecoins_earned: number;
  tips: string[];
  confidence_score: number;
}

// Quiz Types
export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface QuizData {
  question: string;
  scenario_description: string;
  image_suggestion: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  options: QuizOption[];
  correct_answer_id: string;
  explanation_correct: string;
  explanation_incorrect: string;
  fun_fact: string;
  learning_point: string;
  ecoins_reward: number;
  material_category: string;
}

export interface QuizHistoryItem {
  question: string;
  correct: boolean;
  material: string;
  timestamp: string;
}

// Extended User State for Phase 3 & 4
export interface ExtendedUserState extends UserState {
  materialCounts: Record<string, number>; // e.g., { plastic: 5, metal: 2 }
  co2SavedTotal: number;
  cooperativeIncomeTotal: number;
  quizHistory: QuizHistoryItem[];
  quizStats: {
    answered: number;
    correct: number;
    incorrect: number;
    weakMaterials: string[];
  };
}