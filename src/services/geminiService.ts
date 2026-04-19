import { GoogleGenAI, Type } from "@google/genai";
import { NewsVerificationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function verifyNews(content: string): Promise<NewsVerificationResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following news content for accuracy and potential misinformation: "${content}"`,
    config: {
      systemInstruction: "You are a professional fact-checker. Analyze the text for factual accuracy, bias, and common misinformation patterns. Provide a truth score (0-100), a verdict, a concise explanation, and key points of concern or confirmation.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          truthScore: { type: Type.NUMBER },
          verdict: { type: Type.STRING, enum: ['True', 'Mostly True', 'Partially True', 'Misleading', 'False'] },
          explanation: { type: Type.STRING },
          keyPoints: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["truthScore", "verdict", "explanation", "keyPoints"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return result as NewsVerificationResult;
}
