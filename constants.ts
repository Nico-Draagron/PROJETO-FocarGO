import { ActivityItem } from './types';

export const MOCK_HISTORY: ActivityItem[] = [
  {
    id: '1',
    icon: '🔴',
    text: 'Garrafa PET identificada',
    reward: 10,
    timestamp: '2 min atrás'
  },
  {
    id: '2',
    icon: '📦',
    text: 'Caixa de Papelão',
    reward: 15,
    timestamp: '2 horas atrás'
  },
  {
    id: '3',
    icon: '🥤',
    text: 'Lata de Alumínio',
    reward: 20,
    timestamp: 'Ontem'
  }
];

export const APP_TITLE = "FocarGo";
export const TAGLINE = "Recicle, Jogue e Ganhe";

export const MILESTONES = [
  {
    id: 1,
    title: 'Iniciante Consciente',
    description: 'Reciclou 5 itens',
    target: 5,
    current: 3,
    completed: false
  },
  {
    id: 2,
    title: 'Amigo do Ambiente',
    description: 'Reciclou 20 itens',
    target: 20,
    current: 12,
    completed: false
  },
  {
    id: 3,
    title: 'Guerreiro da Reciclagem',
    description: 'Reciclou 50 itens',
    target: 50,
    current: 12,
    completed: false
  }
];

export const QUIZ_GENERATION_PROMPT = `You are an expert environmental educator and quiz creator.
Your goal is to generate a single multiple-choice question to test the user's knowledge about recycling, sustainability, and waste management.

Context:
- User Level: {userLevel}
- Weak Materials (needs practice): {weakMaterials}
- Strong Materials: {strongMaterials}
- Items Identified: {itemCount}

Instructions:
1. Create a question appropriate for the user's level.
2. If "Weak Materials" are provided, prioritize creating a question about those materials.
3. Provide a brief scenario or context.
4. Include a "fun fact" and a "learning point".
5. Set an appropriate ecoins reward (10-50).

Output JSON format:
{
  "question": "string",
  "scenario_description": "string",
  "image_suggestion": "string (emoji)",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "options": [
    { "id": "A", "text": "string", "is_correct": boolean },
    { "id": "B", "text": "string", "is_correct": boolean },
    { "id": "C", "text": "string", "is_correct": boolean }
  ],
  "correct_answer_id": "string",
  "explanation_correct": "string",
  "explanation_incorrect": "string",
  "fun_fact": "string",
  "learning_point": "string",
  "ecoins_reward": number,
  "material_category": "string"
}
`;