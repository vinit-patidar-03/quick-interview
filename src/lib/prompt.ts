import { GenerateQuestionsParams } from "../types/types";

export const generateQuestionsPrompt = async (params: GenerateQuestionsParams) => {
  const { company, role, difficulty, technologies, duration, description, Resume } = params;

  let resumeText = "";

  if (Resume instanceof File) {
    const buffer = await Resume.arrayBuffer();
    const uint8 = new Uint8Array(buffer);

    const fileName = Resume.name.toLowerCase();

    if (fileName.endsWith(".pdf")) {
      const pdfParse  = (await import("pdf-parse")).default;
      const bufferData = Buffer.from(uint8);
      const pdfData = await pdfParse(bufferData);
      resumeText = pdfData.text;
    } else if (fileName.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const bufferData = Buffer.from(uint8);
      const docData = await mammoth.extractRawText({ buffer: bufferData });
      resumeText = docData.value;
    } else if (fileName.endsWith(".txt")) {
      resumeText = new TextDecoder("utf-8").decode(uint8);
    }

    resumeText = resumeText.trim().slice(0, 8000);
  }

  return `
You are an expert technical interviewer.  

Your task is to generate a **set of short, conversational interview questions** that are:  
- Designed for a **vocal interview** (so each question should be brief and easy to say aloud).  
- **One clear idea per question**. Avoid long, multi-part prompts.  
- Questions should be a mix of **conceptual (theory, principles, trade-offs)** and **scenario-based (real-world, applied reasoning)**.  
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

${
  resumeText
    ? `Candidate Resume Context (use this to personalize questions): ${resumeText}`
    : "No resume provided. Generate questions using only the role, company, technologies, and description."
}

For each question, provide output in this structure:  

{
  "question": "string (short and easy to ask aloud)",
  "type": "conceptual | scenario",
  "followups": [
    "string (slightly deeper probe, still short)",
    "string (goes further, adds complexity)",
    "string (advanced, challenging but still vocal-friendly)"
  ],
  "hints": [
    "string (tiny clue, one phrase)",
    "string (medium clue, one sentence)",
    "string (clearer hint, short but close to the answer)"
  ]
}

Rules:  
1. Keep **all questions short, clear, and vocal-friendly**.  
2. One idea per question (avoid chaining multiple questions together).  
3. Follow-ups should feel like a **natural conversation**, each one probing deeper.  
4. Hints should be **progressive nudges**, delivered as short phrases/sentences.  
5. Ensure the content is **relevant to the role, company context, given technologies, and resume (if provided)**.  
6. Provide variety (not just definitions — include scenarios, trade-offs, comparisons, real-world cases).  
7. Adjust the **number and depth** of questions to fit the interview duration.  
8. Output must be a **valid JSON Array**.
`;
};
