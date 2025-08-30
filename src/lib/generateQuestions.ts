import { generateContent } from "@/lib/gemini";
import { generateQuestionsPrompt } from "./prompt";
import { GenerateQuestionsParams, Question } from "../types/types";
import { cleanJsonResponse } from "@/utils/clean-response";

export const generateQuestions = async (params: GenerateQuestionsParams): Promise<Question[]> => {
  const { company, role, difficulty, technologies, duration, description} = params;

  if (!company || !role || !difficulty || !technologies.length || !duration || !description) {
    throw new Error("Missing required parameters for question generation");
  }
 
  const prompt = await generateQuestionsPrompt(params);

  try {
    const response = await generateContent(prompt); 
    const cleanedResponse = cleanJsonResponse(response);
    const questions = parseQuestions(cleanedResponse);
    
    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions");
  }
};

const parseQuestions = (jsonString: string): Question[] => {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (!Array.isArray(parsed)) {
      throw new Error("Response is not an array");
    }
    
    return parsed.map((item, index) => {
      if (!item.question || typeof item.question !== 'string') {
        throw new Error(`Question ${index + 1} is missing or invalid`);
      }

      return {
        question: item.question.trim(),
        type: item.type as "conceptual" | "scenario",
        followups: Array.isArray(item.followups) ? item.followups.map((f: string) => f.trim()) : [],
        hints: Array.isArray(item.hints) ? item.hints.map((h: string) => h.trim()) : [],
      };
    });
  } catch (error) {
    console.error("Error parsing questions:", error);
    throw new Error(`Failed to parse questions: ${error instanceof Error ? error.message : "Invalid JSON"}`);
  }
};

export const generateQuestionsWithRetry = async (
  params: GenerateQuestionsParams,
  maxRetries: number = 3
): Promise<Question[]> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const questions = await generateQuestions(params);
      
      if (questions.length > 0) {
        return questions;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      console.error(`Attempt ${attempt} failed:`, lastError.message);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }
  
  throw lastError || new Error("Failed to generate questions after all retries");
};