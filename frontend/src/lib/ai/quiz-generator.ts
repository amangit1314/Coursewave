import { generateJSON } from "./gemini";

export interface GeneratedQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false";
  options?: string[];
  correctAnswer: string;
  points: number;
}

export async function generateQuizFromContent(
  content: string,
  chapterTitle: string,
  count: number = 5
): Promise<GeneratedQuestion[]> {
  const prompt = `You are an expert educator. Generate ${count} quiz questions based on this chapter content.

CHAPTER: ${chapterTitle}
CONTENT:
${content.substring(0, 3000)}

Rules:
- Mix question types: mostly multiple-choice (4 options each), a few true-false
- Questions should test comprehension, not just memorization
- Make wrong options plausible but clearly incorrect
- Each question worth 10 points

Return JSON array:
[{
  "id": "q1",
  "question": "What is...",
  "type": "multiple-choice",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A",
  "points": 10
}]`;

  const questions = await generateJSON<GeneratedQuestion[]>(prompt);

  return (Array.isArray(questions) ? questions : []).map((q, i) => ({
    ...q,
    id: q.id || `q${i + 1}`,
    points: q.points || 10,
  }));
}
