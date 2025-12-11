import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Button, Card } from '../components/UI';
import { AnalysisResult } from '../types';

interface ScanProps {
  onReward: (amount: number, item: string) => void;
}

// --- SYSTEM INSTRUCTION ---
const SYSTEM_INSTRUCTION = `You are an expert environmental educator and materials scientist specializing in waste management and recycling processes in Brazil. You have deep knowledge of material science, circular economy, and the social impact of recycling cooperatives.

YOUR MISSION:
Analyze waste item images using multimodal understanding and provide comprehensive, educational guidance for proper disposal while teaching users the SCIENCE, IMPACT, and HUMAN CONNECTION behind recycling.

ANALYTICAL FRAMEWORK (Chain-of-Thought Reasoning):

STEP 1 - VISUAL ANALYSIS (Vision API):
- Identify the object in the image with high precision
- Determine primary material composition (plastic, glass, metal, paper, organic, electronic, composite, hazardous)
- Identify specific material type:
  * Plastics: PET (#1), HDPE (#2), PVC (#3), LDPE (#4), PP (#5), PS (#6), Other (#7)
  * Metals: Aluminum, steel, tin, copper
  * Glass: Clear, green, brown, blue
  * Paper: Cardboard, newspaper, magazine, office paper
- Note physical condition (intact, broken, crushed, damaged)
- Detect visible labels, markings, or recycling symbols (#1-#7)
- Assess size and weight visually

STEP 2 - CONTAMINATION ASSESSMENT (Reasoning):
- Check for food residue, liquids, oil, grease, dirt, mold
- Assess cleanliness level: CLEAN / NEEDS WASHING / TOO CONTAMINATED
- Identify removable vs permanent contaminants
- Determine if cleaning is feasible and worth the effort
- Calculate contamination risk to recycling batches

STEP 3 - RECYCLABILITY DETERMINATION (Regional Context):
- Is this material recyclable in Brazil's infrastructure? (YES/NO/SPECIAL COLLECTION)
- Which colored bin according to Brazilian standards:
  * Blue (Azul) = Paper/Cardboard
  * Green (Verde) = Glass
  * Red (Vermelho) = Plastic
  * Yellow (Amarelo) = Metal
  * Brown (Marrom) = Organic
  * Gray (Cinza) = Non-recyclable/General waste
  * Orange (Laranja) = Hazardous waste
- Does it need special handling? (Electronics, batteries, medical waste, chemicals)
- Are there regional variations in collection? (São Paulo vs Rio de Janeiro, etc.)

STEP 4 - EDUCATIONAL EXPLANATION (Natural Language Generation):
- WHY does this material go in this category? (scientific reasoning in simple Portuguese)
- WHAT are the material properties that enable/prevent recycling?
- HOW does the recycling process work for this specific material?
- WHAT is the environmental benefit vs landfill or incineration?
- WHAT happens if disposed incorrectly? (consequences for recycling facility)

STEP 5 - IMPACT QUANTIFICATION (Data-Driven):
- CO₂ emissions saved vs landfill/new production (in kg)
- Energy savings percentage and real-world comparison
- Time required for complete recycling process
- Economic value to recycling cooperatives (R$ per item)
- Water conservation if applicable

STEP 6 - STORYTELLING (Human Connection):
- Generate a narrative about the item's journey from collection to new product
- Include real cooperative context (e.g., "Cooperativa Vila Mariana")
- Connect to real people (e.g., "João, who works at the cooperative")
- Make the impact tangible and emotional

OUTPUT FORMAT (Structured JSON):
Return ONLY valid JSON with this exact structure:

{
  "material": "string - specific material name (e.g., 'Garrafa PET', 'Lata de Alumínio', 'Papelão')",
  "material_details": "string - technical details (e.g., 'Politereftalato de Etileno - Plástico Tipo 1')",
  "category": "string - disposal category (e.g., 'Plástico Reciclável', 'Metal Reciclável')",
  "bin_color": "string - which bin (e.g., 'Vermelho (Plástico)', 'Amarelo (Metal)', 'Azul (Papel)')",
  "bin_emoji": "string - visual emoji (e.g., '🔴', '🟡', '🔵', '🟢')",
  "recyclable": true or false,
  "contamination_detected": true or false,
  "contamination_details": "string or null - description of contamination if detected",
  "cleaning_required": true or false,
  "cleaning_instructions": "string or null - HOW to clean if needed (specific, practical steps)",
  "educational_explanation": "string - 3-4 sentences in simple Brazilian Portuguese explaining WHY this categorization, connecting to real science. Be encouraging and educational.",
  "scientific_fact": "string - fascinating scientific insight about this material or recycling process that surprises and educates",
  "environmental_impact": {
    "co2_saved_kg": "string - amount with tangible context (e.g., '1.2kg - equivalente a não dirigir 5km de carro')",
    "energy_saved": "string - comparison to everyday items (e.g., '95% menos energia = 3 horas de TV ligada')",
    "recycling_time": "string - realistic timeline (e.g., '30-45 dias da coleta até produto novo')",
    "water_saved": "string or null - water conservation if applicable"
  },
  "journey_story": "string - compelling narrative (5-7 sentences) describing this item's journey from collection to new product. Include: WHO collects it (cooperative name), WHERE it goes (facility), HOW it's processed (temperature, method), WHAT it becomes (specific examples), WHY it matters. Make it vivid, specific, and emotionally engaging.",
  "cooperative_impact": "string - specific financial impact on cooperative members (e.g., 'R$0.30 de renda gerada para João da Cooperativa Vila Mariana, que trabalha há 5 anos e sustenta 2 filhos')",
  "ecoins_earned": number (10-30 based on: 10=simple clean item, 15=needs basic cleaning, 20=intermediate complexity, 25=advanced material knowledge, 30=complex/composite material),
  "tips": [
    "string - practical, actionable tip 1",
    "string - practical, actionable tip 2"
  ],
  "confidence_score": number (0-100 - your confidence in this analysis. Be honest. If unsure, say so and explain why.)
}

TONE & STYLE GUIDELINES:
- Use natural Brazilian Portuguese (não formal demais, mas educado)
- Be encouraging and celebratory, never judgmental
- Explain the "why" behind every instruction using accessible science
- Connect every action to REAL IMPACT (people, environment, economy)
- Use concrete numbers and tangible comparisons
- Make users feel like environmental heroes
- If user makes a mistake, gently educate without shame
- Celebrate correct behavior enthusiastically`;

// --- COMPONENTS ---

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-brand-beige/90 z-[60] flex flex-col items-center justify-center p-6 animate-fade-in backdrop-blur-sm">
    <div className="w-16 h-16 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-6"></div>
    <div className="text-xl font-bold text-brand-darkPurple mb-2 text-center animate-pulse">{message}</div>
    <div className="text-sm text-brand-petrol font-medium">Powered by Gemini 3 Pro 🤖</div>
  </div>
);

const AnalysisResultModal: React.FC<{ 
  result: AnalysisResult; 
  image: string; 
  onClose: () => void;
  onNext: () => void;
}> = ({ result, image, onClose, onNext }) => {
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="min-h-screen px-4 py-6 flex items-center justify-center">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slide-up relative">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-brand-darkPurple hover:bg-black/20 transition-colors z-10"
          >
            ×
          </button>

          <div className="p-6 pb-0">
             <div className="flex justify-between items-start mb-4">
               <h2 className="text-2xl font-bold text-brand-darkPurple leading-tight pr-8">{result.material}</h2>
             </div>
             <div className="inline-block bg-brand-darkPurple/5 text-brand-darkPurple text-xs font-bold px-2 py-1 rounded-md mb-4">
               Confiança: {result.confidence_score}%
             </div>
          </div>

          {/* Image & Category Banner */}
          <div className="relative h-48 bg-gray-100 mb-4 mx-6 rounded-2xl overflow-hidden shadow-inner">
            <img src={image} alt="Analyzed Item" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-brand-teal to-brand-lightGreen p-3 text-white flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <span className="text-3xl">{result.bin_emoji}</span>
                 <div className="leading-tight">
                   <div className="font-bold text-sm opacity-90">{result.bin_color}</div>
                   <div className="font-semibold text-xs">{result.category}</div>
                 </div>
               </div>
               <div className={`px-2 py-1 rounded text-xs font-bold ${result.recyclable ? 'bg-white/20' : 'bg-red-500/80'}`}>
                 {result.recyclable ? '♻️ Reciclável' : '⚠️ Não Reciclável'}
               </div>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-5">
            
            {/* Contamination Alert */}
            {result.contamination_detected && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <div className="flex items-start gap-2 mb-2 text-orange-700">
                  <span className="text-lg">⚠️</span>
                  <strong className="font-bold">Contaminação Detectada</strong>
                </div>
                <p className="text-sm text-brand-petrol mb-3">{result.contamination_details}</p>
                {result.cleaning_instructions && (
                   <div className="bg-white/60 rounded-lg p-3 text-sm">
                     <strong className="block text-brand-darkPurple text-xs uppercase mb-1">Como limpar:</strong>
                     <p className="text-brand-petrol">{result.cleaning_instructions}</p>
                   </div>
                )}
              </div>
            )}

            {/* Educational Section */}
            <div>
              <h3 className="font-bold text-brand-darkPurple mb-2 flex items-center gap-2">
                💡 Por Que Esta Categoria?
              </h3>
              <p className="text-brand-petrol text-sm leading-relaxed bg-brand-beige/50 p-3 rounded-xl border border-brand-teal/10">
                {result.educational_explanation}
              </p>
            </div>

            {/* Scientific Fact */}
            <div className="flex gap-4 items-start">
               <div className="text-2xl bg-brand-purple/10 w-12 h-12 flex items-center justify-center rounded-full shrink-0">🔬</div>
               <div>
                 <strong className="block text-brand-purple mb-1">Você Sabia?</strong>
                 <p className="text-sm text-brand-petrol/80 italic">"{result.scientific_fact}"</p>
               </div>
            </div>

            {/* Environmental Impact Grid */}
            <div className="bg-brand-petrol/5 rounded-2xl p-4">
              <h3 className="font-bold text-brand-darkPurple mb-3 text-sm uppercase tracking-wide">🌍 Seu Impacto Ambiental</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                  <span className="text-xl">🌱</span>
                  <div>
                    <div className="text-xs text-gray-500 font-bold uppercase">CO₂ Economizado</div>
                    <div className="text-sm font-semibold text-brand-petrol">{result.environmental_impact.co2_saved_kg}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm">
                  <span className="text-xl">⚡</span>
                  <div>
                     <div className="text-xs text-gray-500 font-bold uppercase">Energia</div>
                     <div className="text-sm font-semibold text-brand-petrol">{result.environmental_impact.energy_saved}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Story */}
            <div>
               <h3 className="font-bold text-brand-darkPurple mb-2">📦 Jornada do Seu Item</h3>
               <p className="text-sm text-brand-petrol leading-relaxed">{result.journey_story}</p>
            </div>

             {/* Cooperative Impact */}
             <div className="bg-gradient-to-br from-brand-purple to-brand-darkPurple rounded-xl p-5 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">❤️ Impacto Humano</h3>
                <p className="text-sm opacity-90">{result.cooperative_impact}</p>
             </div>

             {/* Tips */}
             {result.tips && result.tips.length > 0 && (
               <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                 <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">💡 Dicas Práticas</h3>
                 <ul className="list-disc list-inside text-sm text-yellow-900 space-y-1">
                   {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                 </ul>
               </div>
             )}

          </div>

          {/* Footer Reward & Actions */}
          <div className="bg-white border-t p-6 sticky bottom-0 z-20">
             <div className="bg-gradient-to-r from-brand-lightGreen to-brand-teal rounded-xl p-4 mb-4 flex items-center justify-between text-white shadow-md animate-pulse-slow">
               <div className="flex items-center gap-2">
                 <span className="text-2xl">💰</span>
                 <span className="font-bold text-xl">+{result.ecoins_earned} ecoins</span>
               </div>
               <span className="text-xs bg-white/20 px-2 py-1 rounded font-bold uppercase">Recompensa</span>
             </div>

             <div className="flex gap-3">
               <Button variant="primary" fullWidth onClick={onNext} className="shadow-brand-teal/20">
                 Identificar Próximo →
               </Button>
               <Button variant="secondary" onClick={() => {}} className="px-4">
                 📤
               </Button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---

const Scan: React.FC<ScanProps> = ({ onReward }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null); // Reset previous results
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    
    try {
      // 1. Convert Data URL to Base64 (remove header)
      const base64Data = image.split(',')[1];

      // 2. Initialize Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // 3. Call API
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Using Gemini 3 Pro as requested
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg', // Assuming jpeg/png from input
                data: base64Data
              }
            },
            {
              text: "Analyze this waste item image and provide comprehensive identification, proper disposal category, educational content, and environmental impact in JSON format as specified. Return ONLY valid JSON, no markdown formatting or code blocks."
            }
          ]
        },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json', // Force JSON structure
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
        }
      });

      // 4. Parse Response
      const responseText = response.text;
      if (!responseText) throw new Error("No response from AI");
      
      // Clean up potential markdown formatting just in case
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedData = JSON.parse(cleanedText) as AnalysisResult;

      // 5. Update State
      setResult(parsedData);
      
      // 6. Award Ecoins (optimistically, or could wait for user confirmation)
      onReward(parsedData.ecoins_earned, parsedData.material);

    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      alert("Ops! Não conseguimos analisar essa imagem. Tente novamente com melhor iluminação.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setImage(null);
    setResult(null);
  };

  const handleNext = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-8 animate-fade-in relative">
      
      {isAnalyzing && <LoadingOverlay message="Analisando com Gemini 3 Pro..." />}

      {result && image && (
        <AnalysisResultModal 
          result={result} 
          image={image} 
          onClose={handleNext} 
          onNext={handleNext} 
        />
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-brand-darkPurple mb-2">Identificar Resíduo</h2>
        <p className="text-brand-petrol/70">
          {image ? "Confirme a foto para análise" : "Tire uma foto para análise instantânea"}
        </p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        {!image ? (
          <>
            {/* Camera Trigger Button */}
            <div className="relative group">
               <div className="absolute inset-0 bg-brand-lightGreen rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse-slow"></div>
               <button 
                id="cameraButton"
                onClick={handleCameraClick}
                className="relative w-40 h-40 rounded-full bg-gradient-to-br from-brand-teal to-brand-lightGreen border-4 border-white shadow-[0_8px_24px_rgba(15,143,109,0.4)] flex flex-col items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
              >
                <span className="text-5xl mb-2">📷</span>
                <span className="text-sm font-bold uppercase tracking-wide">Fotografar</span>
              </button>
            </div>
            
            <div className="mt-12 w-full max-w-sm">
              <Card className="bg-brand-teal/5 border border-brand-teal/10">
                <h3 className="font-bold text-brand-darkPurple mb-3 flex items-center gap-2">
                  <span>💡</span> Dicas para melhor resultado:
                </h3>
                <ul className="text-sm text-brand-petrol space-y-2">
                  <li className="flex items-center gap-2">✓ Use boa iluminação</li>
                  <li className="flex items-center gap-2">✓ Centralize o item na foto</li>
                  <li className="flex items-center gap-2">✓ Evite fotos embaçadas</li>
                </ul>
              </Card>
            </div>
          </>
        ) : (
          <div className="w-full max-w-md flex flex-col gap-4">
            {/* Image Preview */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-square bg-black">
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            </div>

            {/* Pre-Analysis Actions */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button variant="outline" onClick={handleRetake} disabled={isAnalyzing}>
                Retirar
              </Button>
              <Button onClick={analyzeImage} disabled={isAnalyzing}>
                Analisar
              </Button>
            </div>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Scan;