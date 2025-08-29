import { generateContent } from "@/lib/gemini";
import { GenerateDescriptionParams } from "../types/types";
import { cleanJsonResponse } from "@/utils/clean-response";

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

export const generateFeedback = async (transcript: string): Promise<string> => {
  const prompt = `
You are an AI technical interviewer providing structured feedback for a vocal technical interview.

## Transcript to Analyze
${transcript}

## Analysis Instructions
1. **Read the entire transcript carefully** - Pay attention to both interviewer questions and candidate responses
2. **Identify specific examples** from the conversation for each evaluation category
3. **Quote relevant parts** of the transcript to support your assessments
4. **Base your scoring** on actual demonstrated behaviors, not assumptions

## Scoring Guidelines
Rate each category on a 10-point scale:
- **9-10**: Outstanding performance, exceeds expectations
- **7-8**: Strong performance, meets expectations  
- **5-6**: Good performance, average level
- **3-4**: Below average, needs improvement
- **1-2**: Poor performance, major deficiencies

## Required Output Format (JSON Structure)

Return your analysis in the following JSON format:

\`\`\`json
{
  "overallScore": {
    "total": 0,
    "outOf": 40,
    "percentage": 0,
    "level": "Needs Improvement | Average | Good | Strong | Outstanding"
  },
  "categoryScores": {
    "communication": {
      "score": 0,
      "outOf": 10,
      "transcriptEvidence": ["Quote from transcript supporting this score"],
      "strengths": ["Specific strength observed"],
      "improvements": ["Specific area for improvement"]
    },
    "problemSolving": {
      "score": 0,
      "outOf": 10,
      "transcriptEvidence": ["Quote from transcript supporting this score"],
      "strengths": ["Specific strength observed"],
      "improvements": ["Specific area for improvement"]
    },
    "handlingAmbiguity": {
      "score": 0,
      "outOf": 10,
      "transcriptEvidence": ["Quote from transcript supporting this score"],
      "strengths": ["Specific strength observed"],
      "improvements": ["Specific area for improvement"]
    },
    "incorporatingFeedback": {
      "score": 0,
      "outOf": 10,
      "transcriptEvidence": ["Quote from transcript supporting this score"],
      "strengths": ["Specific strength observed"],
      "improvements": ["Specific area for improvement"]
    }
  },
  "summaryFeedback": [
    "Key feedback point 1 based on transcript",
    "Key feedback point 2 based on transcript", 
    "Key feedback point 3 based on transcript",
    "Key feedback point 4 based on transcript",
    "Key feedback point 5 based on transcript"
  ]
}
\`\`\`

## Category Evaluation:

### Communication (0-10 points)
How clearly the candidate explains technical concepts and engages in discussion

### Problem Solving (0-10 points)  
Systematic approach to tackling problems and critical thinking

### Handling Ambiguity (0-10 points)
Ability to work with unclear requirements and ask clarifying questions

### Incorporating Feedback (0-10 points)
How well the candidate receives and integrates hints or guidance

## Important Instructions:
1. **Fill in ALL fields** with actual analysis from the transcript
2. **Use real quotes** from the transcript in transcriptEvidence arrays
3. **Be specific** in strengths and improvements - reference actual moments
4. **Calculate the overall score** by summing all category scores (out of 40)
5. **Base everything** on actual performance from the conversation
6. **Provide 5 key summary points** that capture the most important feedback
7. **Ensure JSON is valid** and properly formatted
  `;
    
    const feedback = await generateContent(prompt);
    
  return JSON.parse(cleanJsonResponse(feedback));
};