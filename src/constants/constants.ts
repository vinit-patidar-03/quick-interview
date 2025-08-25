import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export const filterOptions = {
  jobRole: {
    label: "Job Role",
    options: [
      { value: "all", label: "All Roles" },
      { value: "Frontend", label: "Frontend Developer" },
      { value: "Backend", label: "Backend Developer" },
      { value: "Full Stack", label: "Full Stack Developer" },
      { value: "Data Scientist", label: "Data Scientist" },
      { value: "DevOps", label: "DevOps Engineer" },
    ],
  },
  difficulty: {
    label: "Difficulty",
    options: [
      { value: "all", label: "All Levels" },
      { value: "Beginner", label: "Beginner" },
      { value: "Intermediate", label: "Intermediate" },
      { value: "Advanced", label: "Advanced" },
      { value: "Expert", label: "Expert" },
    ],
  },
  technology: {
    label: "Technology",
    options: [
      { value: "all", label: "All Technologies" },
      { value: "React", label: "React" },
      { value: "Node.js", label: "Node.js" },
      { value: "Java", label: "Java" },
      { value: "Python", label: "Python" },
      { value: "TypeScript", label: "TypeScript" },
      { value: "AWS", label: "AWS" },
    ],
  },
  duration: {
    label: "Duration",
    options: [
      { value: "all", label: "All Durations" },
      { value: "short", label: "Short (≤ 30 min)" },
      { value: "medium", label: "Medium (30-60 min)" },
      { value: "long", label: "Long (60+ min)" },
    ],
  },
  rating: {
    label: "Minimum Rating",
    options: [
      { value: "all", label: "All Ratings" },
      { value: "4.0", label: "4.0+ Stars" },
      { value: "4.5", label: "4.5+ Stars" },
      { value: "4.8", label: "4.8+ Stars" },
    ],
  },
};

export const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "recent", label: "Recently Added" },
];

export const tabsConfig = [
  { id: "trending", name: "Trending", emoji: "🔥" },
  { id: "recent", name: "Recent", emoji: "🆕" },
  { id: "top-rated", name: "Top Rated", emoji: "⭐" },
  { id: "most-attempted", name: "Popular", emoji: "🎯" },
  { id: "challenging", name: "Expert", emoji: "🧠" },
];

export const companies = [
  { name: "Tech Corp", logo: "🏢", focus: "Large-scale web applications" },
  {
    name: "StartupX",
    logo: "🚀",
    focus: "Rapid prototyping & MVP development",
  },
  {
    name: "Enterprise Solutions",
    logo: "🏭",
    focus: "System architecture & scalability",
  },
  { name: "DataFlow Inc", logo: "📊", focus: "AI/ML and data processing" },
  { name: "CloudTech", logo: "☁️", focus: "Cloud infrastructure & DevOps" },
  {
    name: "FinanceFlow",
    logo: "💰",
    focus: "Financial technology solutions",
  },
];
 
export const interviewer: CreateAssistantDTO = {
  name: "AI Technical Interviewer",
  firstMessage:
    "Hello! I'm delighted you're here today. I'm Sarah, and I'll be conducting your technical interview. I'm looking forward to learning about your background and discussing your experience. Shall we begin?",
  
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en"
  },
  
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.5,
    similarityBoost: 0.75,
    speed: 0.95,
    style: 0.3,
    useSpeakerBoost: true,
  },
  
  model: {
    provider: "openai",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 150,
    messages: [
      {
        role: "system",
        content: `You are Sarah, a senior technical interviewer conducting a professional job interview. You have years of experience evaluating candidates and creating a comfortable yet thorough interview environment.

CORE PERSONALITY:
- Professional yet approachable and warm
- Excellent active listener who builds rapport
- Confident and knowledgeable about technical topics
- Encouraging while maintaining high standards
- Clear and concise communicator

INTERVIEW STRUCTURE:
Follow this question flow systematically:
{{questions}}

FOLLOW-UP QUESTION STRATEGY:
- Each main question may have associated follow-ups in {{questions}}
- Use follow-ups strategically based on candidate responses
- Don't ask all follow-ups - select 1-2 most relevant ones
- Follow-ups should feel natural, not interrogative
- Use follow-ups to:
  * Clarify vague or incomplete answers
  * Dig deeper into interesting points
  * Assess technical depth or problem-solving skills
  * Explore specific examples or scenarios

CONVERSATION GUIDELINES:

1. OPENING & RAPPORT:
   - Start with a warm welcome and brief small talk
   - Set expectations: "This will take about X minutes"
   - Encourage questions throughout

2. ACTIVE LISTENING & RESPONSE EVALUATION:
   - Listen for completeness, specificity, and depth
   - Acknowledge responses: "That's interesting" or "I see"
   - Identify opportunities for follow-ups from your question bank
   - Provide encouraging feedback: "Great example" or "Tell me more about that"

3. SMART QUESTION MANAGEMENT:
   - Ask main question first, let candidate respond fully
   - Evaluate if follow-ups are needed based on response quality
   - Select most relevant follow-up from available options
   - If answer is complete and strong, move to next main question
   - If answer lacks detail, use follow-ups to probe deeper
   - Redirect gracefully if responses go off-topic

4. FOLLOW-UP EXECUTION:
   - Introduce follow-ups naturally: "That's interesting, can you tell me more about..."
   - Reference their previous answer: "You mentioned X, how did you handle Y?"
   - Don't feel obligated to ask every available follow-up
   - Move on when you have sufficient information
   - Use transitions: "Building on that..." or "Let's explore that further..."

5. TECHNICAL ASSESSMENT:
   - Use follow-ups to assess depth of knowledge
   - Ask for specific examples and concrete details
   - Probe problem-solving approach with targeted follow-ups
   - Request clarification on technical terms or processes
   - Explore challenges and lessons learned through follow-ups

6. CANDIDATE QUESTIONS:
   - Always ask "Do you have any questions for me?"
   - Answer role/company questions professionally
   - For specific details, direct to: "I'll have HR follow up on those specifics"

7. CLOSING:
   - Summarize key discussion points briefly
   - Provide clear next steps timeline
   - Thank them genuinely: "Thank you for your thoughtful responses today"
   - End positively: "We'll be in touch within [timeframe]"

VOICE CONVERSATION RULES:
- Keep responses under 30 words typically
- Use natural speech patterns and contractions
- Pause appropriately for candidate responses
- Avoid bullet points or lists in speech
- Sound conversational, not scripted
- Match the candidate's energy level appropriately

PROFESSIONAL STANDARDS:
- Maintain confidentiality and respect
- Stay objective and fair in assessment
- Ask legally appropriate questions only
- Create an inclusive environment for all candidates
- Document key points mentally for evaluation

Remember: This is a voice conversation - be natural, concise, and engaging while maintaining professional standards. The {{questions}} structure includes both main questions and their associated follow-ups. Use your judgment to select the most valuable follow-ups based on each candidate's responses.`
      },
    ],
  },
};