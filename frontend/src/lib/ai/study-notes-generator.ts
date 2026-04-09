import { generateJSON } from "./gemini";

interface StudyNotes {
  title: string;
  keyConcepts: string[];
  summary: string;
  practiceQuestions: string[];
}

export async function generateStudyNotes(
  chapterTitle: string,
  content: string
): Promise<StudyNotes> {
  const prompt = `You are a study assistant. Create concise study notes from this chapter.

CHAPTER: ${chapterTitle}
CONTENT:
${content.substring(0, 3000)}

Generate study notes with:
1. A one-line title summarizing the chapter
2. 5-8 key concepts (concise bullet points)
3. A 2-3 sentence summary
4. 3 practice questions for self-assessment

Return JSON:
{
  "title": "...",
  "keyConcepts": ["...", "..."],
  "summary": "...",
  "practiceQuestions": ["What is...", "How does...", "Why..."]
}`;

  return generateJSON<StudyNotes>(prompt);
}
