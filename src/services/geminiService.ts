import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export const spanishTutorSystemInstruction = `
You are "Prof. Luis", a friendly and expert Spanish tutor for Portuguese speakers. 
Your goal is to help users learn Spanish in a natural, engaging, and culturally rich way.

Guidelines:
1. Always be encouraging and patient.
2. If the user speaks Portuguese, respond in a mix of Spanish and Portuguese (favoring Spanish as they progress).
3. Correct mistakes gently. Explain the "why" behind the correction.
4. Use cultural references from Spain and Latin America.
5. Provide examples of common idioms (modismos).
6. If asked for translations, provide them with context.
7. Format your responses using Markdown for clarity (bold for key terms, lists for examples).
`;

export async function getSpanishResponse(messages: ChatMessage[]) {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    })),
    config: {
      systemInstruction: spanishTutorSystemInstruction,
      temperature: 0.7,
    },
  });

  return response.text || "Lo siento, no pude procesar eso. ¿Puedes repetir?";
}

export interface Flashcard {
  word: string;
  translation: string;
  example: string;
  category: string;
}

export async function generateFlashcards(topic: string): Promise<Flashcard[]> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Gere 15 flashcards de espanhol sobre o tema: ${topic}. 
    Retorne um JSON com a seguinte estrutura: 
    Array de objetos com { word: string (espanhol), translation: string (português), example: string (frase em espanhol), category: string }.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            translation: { type: Type.STRING },
            example: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["word", "translation", "example", "category"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse flashcards", e);
    return [];
  }
}

export async function generateGrammarExplanation(topic: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Explique o seguinte tópico de gramática espanhola para um falante de português: ${topic}.
    
    A explicação deve conter:
    1. Uma introdução clara.
    2. Regras principais com exemplos em espanhol e tradução.
    3. Dicas para evitar erros comuns (falsos amigos, etc).
    4. Uma pequena lista de exercícios rápidos (com respostas no final).
    
    Use Markdown para formatar a resposta de forma elegante.`,
    config: {
      systemInstruction: "Você é um professor de espanhol especialista em gramática comparada (Espanhol/Português).",
      temperature: 0.5,
    },
  });

  return response.text || "Lo siento, no pude generar la explicación en este momento.";
}

export async function generateSpeech(text: string): Promise<string | undefined> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Zephyr' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}
