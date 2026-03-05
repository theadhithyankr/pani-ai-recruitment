import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askAssistant(prompt: string, context: { type: 'career' | 'hiring'; userRole: string }) {
  const systemInstruction = `
    You are "paniBot", a career and hiring assistant for pani.
    
    User Role: ${context.userRole}
    Context: ${context.type === 'career' ? 'Helping talent find jobs and improve their profile.' : 'Helping employers find the best talent.'}
    
    Guidelines:
    1. Provide actionable advice on resumes, portfolios, or job descriptions.
    2. Be professional, encouraging, and concise.
    3. Use data-driven insights where possible.
    4. If asked about specific platform features, explain how pani helps.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
    },
  });

  return response.text;
}
