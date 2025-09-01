import { GoogleGenerativeAI } from "@google/generative-ai";

// This function generates a detailed learning roadmap for a given skill.
// It uses the gemini-2.5-flash-preview-05-20 model and includes a check
// to ensure the API key is present before making the request.
export async function generateRoadmapWithAI(skill: string) {
    try {
        // IMPORTANT: In Next.js, environment variables must be
        // prefixed with NEXT_PUBLIC_. The code below accesses the key
        // from the .env file, or uses the empty string for the Canvas environment.
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

        if (!apiKey) {
            throw new Error("API key is not defined. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file or ensure it is provided by the environment.");
        }

        // Initialize the Gemini client with the API key.
        // We're using gemini-2.5-flash-preview-05-20 for higher free-tier quotas.
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

        // Define the prompt for the AI.
        const prompt = `
            You are an expert learning path generator. Create a detailed roadmap for learning "${skill}".
            The roadmap should include:
            - A structured progression from beginner to advanced
            - Estimated time for each stage
            - Key concepts to learn at each stage
            - Recommended resources (books, courses, tutorials)
            - Practical projects for each stage
            
            Format the response as a JSON object with this structure:
            {
                "title": string,
                "description": string,
                "duration": string,
                "difficulty": string,
                "category": string,
                "nodes": Array<{
                    "id": string,
                    "title": string,
                    "description": string,
                    "type": "foundation" | "intermediate" | "advanced" | "expert",
                    "estimatedTime": string,
                    "resources": Array<{
                        "title": string,
                        "url": string,
                        "type": "book" | "course" | "tutorial" | "documentation",
                        "description": string
                    }>,
                    "projects": string[]
                }>,
                "edges": Array<{
                    "source": string,
                    "target": string
                }>
            }
        `;

        // Use generationConfig to explicitly request a JSON response.
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
            },
        });

        const text = result.response.text();
        const roadmap = JSON.parse(text);

        // Add positions to the nodes for a visual representation.
        const positionedNodes = roadmap.nodes.map((node: any, index: number) => ({
            ...node,
            position: calculateNodePosition(index, roadmap.nodes.length),
        }));

        return {
            ...roadmap,
            nodes: positionedNodes,
        };
    } catch (error) {
        console.error("Error generating roadmap with AI:", error);
        throw error;
    }
}

// Helper function to calculate a simple position for the nodes.
function calculateNodePosition(index: number, total: number) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
        x: col * 300,
        y: row * 200,
    };
}
