import { generateContent } from "@/lib/gemini";
import { GenerateDescriptionParams } from "../types/types";

export const generateDescription = async (params: GenerateDescriptionParams): Promise<string> => {
    const { company, role, difficulty, technologies } = params;
    const prompt = `
    You are a helpful assistant that generates a Job Description for an interview.
    Company: ${company}
    Role: ${role}
    Difficulty: ${difficulty}
    Technologies: ${technologies.join(", ")}
    Generate a brief job description for the interview in 100 words.
    Return only the job description, no other text.
    `;
    const description = await generateContent(prompt);
    return description;
};