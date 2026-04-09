import { generateJSON } from "./gemini";

export async function generateRoadmapWithAI(skill: string) {
    try {
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

        const roadmap = await generateJSON(prompt);

        // Add positions to the nodes for a visual representation.
        const positionedNodes = (roadmap.nodes || []).map((node: any, index: number) => ({
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
