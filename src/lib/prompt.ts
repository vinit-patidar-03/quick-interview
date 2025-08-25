import { GenerateQuestionsParams } from "../types/types";

export const generateQuestionsPrompt = (params: GenerateQuestionsParams) => {
  const { company, role, difficulty, technologies, duration, description } = params;
  return `
You are an expert technical interviewer.  

Your task is to generate a **set of structured interview questions** that are:  
- Vocally explainable (no code editor, no implementation-heavy problems).  
- Conceptual (theory, principles, trade-offs) **and** Scenario-based (real-world cases, applied reasoning).  
- Mixed question set: include **both conceptual and scenario questions** in roughly equal proportion.  
- Aligned with the given role, company, and required technologies.  
- Difficulty should match the requested level ('easy', 'medium', 'hard').  
- The number of questions should be adjusted to fit within the interview duration (${duration} minutes).  
- Use the company context to make questions more relevant.  

The interview is for:  
Role: ${role}  
Company: ${company}  
Technologies: ${technologies}  
Difficulty: ${difficulty}  
Duration: ${duration} minutes  
Company Context: ${description}  

For each question, provide output in this structure:  

{
  "question": "string",
  "type": "conceptual | scenario",
  "followups": [
    "string (basic follow-up, easiest)",
    "string (intermediate follow-up, probes deeper)",
    "string (advanced follow-up, most challenging)"
  ],
  "hints": [
    "string (smallest nudge, very high-level)",
    "string (medium nudge, guiding reasoning)",
    "string (detailed nudge, close to the answer)"
  ]
}

Rules:  
1. Include a **balanced mix** of conceptual and scenario questions.  
2. Follow-up questions must be in **increasing order of depth** (basic → advanced).  
3. Hints must be in **increasing order of detail** (tiny clue → partial reasoning → near answer).  
4. Avoid coding/implementation problems; keep everything **vocally explainable**.  
5. Ensure the content is **relevant to the role, company context, and given technologies**.  
6. Provide variety (not just definitions — include scenarios, trade-offs, comparisons, real-world cases).  
7. Adjust the **number and depth** of questions to fit the interview duration.
8. Output must be **valid JSON Array**
e.g.:
[
  {
    "question": "string",
    "type": "conceptual | scenario",
    "followups": [
      "string (basic follow-up, easiest)",
      "string (intermediate follow-up, probes deeper)",
      "string (advanced follow-up, most challenging)"
    ],
    "hints": [
      "string (smallest nudge, very high-level)",
      "string (medium nudge, guiding reasoning)",
      "string (detailed nudge, close to the answer)"
    ]
  }
]
`;  
}
