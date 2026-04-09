import { GoogleGenerativeAI } from "@google/generative-ai";

let genAIInstance: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error(
      "Gemini API key not configured. Set NEXT_PUBLIC_GEMINI_API_KEY in your .env file."
    );
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
}

export function getGeminiModel() {
  return getGenAI().getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
  });
}

export async function generateJSON<T = any>(prompt: string): Promise<T> {
  const model = getGeminiModel();
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch {
    // Fallback: extract array from text
    const lines = text
      .split("\n")
      .filter((l) => l.trim().length > 10)
      .map((l) => l.replace(/^[-•*\d.\s]+/, "").trim())
      .filter(Boolean);
    return lines as unknown as T;
  }
}

export async function generateText(prompt: string): Promise<string> {
  const model = getGeminiModel();
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4 },
  });
  return result.response.text();
}
