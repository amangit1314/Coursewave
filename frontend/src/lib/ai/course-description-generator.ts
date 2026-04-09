import { generateJSON } from "./gemini";

interface CourseDescriptionResult {
  description: string;
  learningOutcomes: string[];
  prerequisites: string[];
  targetAudience: string;
}

export async function generateCourseDescription(
  title: string,
  category?: string
): Promise<CourseDescriptionResult> {
  const prompt = `You are an expert course creator. Generate a compelling course description for an online course.

COURSE TITLE: ${title}
${category ? `CATEGORY: ${category}` : ""}

Generate:
1. A compelling 2-3 sentence description that sells the course
2. 4-6 specific learning outcomes (what students will be able to do)
3. 2-3 prerequisites
4. One sentence describing the target audience

Return JSON:
{
  "description": "...",
  "learningOutcomes": ["By the end, you will...", ...],
  "prerequisites": ["Basic knowledge of...", ...],
  "targetAudience": "This course is for..."
}`;

  return generateJSON<CourseDescriptionResult>(prompt);
}
