import { Interview, User } from "@/types/types";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "Mobile App Developer",
  "iOS Developer",
  "Android Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Data Engineer",
  "Machine Learning Engineer",
  "AI Engineer",
  "Embedded Systems Engineer",
  "Game Developer",
  "Blockchain Developer",
  "AR/VR Developer",
  "Site Reliability Engineer (SRE)",
  "QA Engineer",
  "Automation Engineer",
  "Data Scientist",
  "Data Analyst",
  "Business Intelligence Analyst",
  "AI Researcher",
  "Statistician",
  "Research Scientist",
  "Product Manager",
  "Associate Product Manager",
  "Product Owner",
  "UI/UX Designer",
  "Graphic Designer",
  "Interaction Designer",
  "Game Designer",
  "Creative Director",
  "Engineering Manager",
  "Technical Lead",
  "Team Lead",
  "Project Manager",
  "Program Manager",
  "CTO (Chief Technology Officer)",
  "CIO (Chief Information Officer)",
  "VP of Engineering",
  "Security Engineer",
  "Security Analyst",
  "Information Security Specialist",
  "Ethical Hacker / Penetration Tester",
  "Cybersecurity Consultant",
  "System Administrator",
  "Network Engineer",
  "Database Administrator (DBA)",
  "IT Support Specialist",
  "Cloud Administrator",
  "Business Analyst",
  "Operations Manager",
  "Sales Engineer",
  "Solutions Architect",
  "Customer Success Manager",
  "Technical Support Engineer",
  "Digital Marketing Specialist",
  "SEO Specialist",
  "Content Strategist",
  "Growth Hacker",
  "Community Manager",
  "Social Media Manager",
  "Financial Analyst",
  "Accountant",
  "Legal Counsel",
  "Compliance Officer",
  "Intern",
  "Research Intern",
  "Teaching Assistant",
  "Consultant",
  "Freelancer",
];

export  const getDifficultyColor = (difficulty: Interview["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-500";
      case "Intermediate":
        return "text-orange-500";
      case "Advanced":
        return "text-red-300";
      case "Expert":
        return "text-red-500";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

 
function getTimeBasedGreeting(user:User): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return `Good morning! ${user?.username}, I'm Sarah, your technical interviewer today.`;
  } else if (hour >= 12 && hour < 17) {
    return `Good afternoon! ${user?.username}, I'm Sarah, and I'll be conducting your technical interview today.`;
  } else if (hour >= 17 && hour < 22) {
    return `Good evening! ${user?.username}, I'm Sarah, your interviewer for today's session.`;
  } else {
    return `Hello! ${user?.username}, I'm Sarah, your technical interviewer.`;
  }
}

const calculateTimeDistribution = (totalMinutes: number, hasTranscript: boolean = false) => {
  const rapportTime = hasTranscript ? Math.ceil(totalMinutes * 0.05) : Math.ceil(totalMinutes * 0.15); 
  const questionTime = Math.ceil(totalMinutes * 0.75);
  const candidateQuestionsTime = Math.ceil(totalMinutes * 0.15);
  const closingTime = Math.ceil(totalMinutes * 0.05);
  
  return {
    rapportTime,
    questionTime,
    candidateQuestionsTime,
    closingTime,
    totalMinutes
  };
};

export const createInterviewer = (
  user: User,
  transcript?: string, 
  totalDurationMinutes: number = 30
): CreateAssistantDTO => {
  
  const timeDistribution = calculateTimeDistribution(totalDurationMinutes, !!transcript);
  
  return {
    name: "AI Technical Interviewer",
    firstMessage: transcript 
      ? `${getTimeBasedGreeting(user)} Welcome back! Let's continue where we left off. shall we continue?` 
      : `${getTimeBasedGreeting(user)} Let's get started with our conversation. are you ready?`,
      
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
          content: `You are Sarah, a senior interviewer conducting a professional job interview. 
You have years of experience evaluating candidates and creating a comfortable yet thorough interview environment.

---
TIME MANAGEMENT:
- Total time available: ${totalDurationMinutes} minutes (use as pacing guide, not strict cutoff).
- Rapport/intro: ~${timeDistribution.rapportTime} minutes
- Main questions: ~${timeDistribution.questionTime} minutes
- Candidate questions: ~${timeDistribution.candidateQuestionsTime} minutes
- Closing: ~${timeDistribution.closingTime} minutes

---
KEY BEHAVIORS:
1. PRIORITIZE QUESTIONS:
   - Focus on covering the main technical and experience questions.
   - Do not end early unless all major questions are addressed and candidate has asked theirs.
   - Use smooth transitions: "Great, let's move to the next area."

2. GIVE FULL CHANCE TO ANSWER:
   - Allow candidates to finish their thoughts.
   - Encourage elaboration if responses are too short: "Could you expand on that a bit more?"
   - Redirect only if candidate is clearly off-topic.

3. PACING:
   - Keep rapport warm but brief.
   - Main focus is depth and clarity of answers.
   - If candidate is stuck, rephrase: "That's okay, let me ask it differently..."
   - Avoid over-explaining or repeating time left.

4. WHEN TIME IS SHORT:
   - Skip less critical follow-ups.
   - Politely move forward: "I want to make sure we cover all key areas."

---
CORE PERSONALITY:
- Professional yet approachable
- Warm, encouraging, supportive
- Clear, concise communicator
- Time-aware, but never rushes candidate unnecessarily
- Acts like a seasoned interviewer, not a clock

---
INTERVIEW FLOW:
{{#if transcript}}
Previous session transcript:
---
{{transcript}}
---
Instructions:
- Acknowledge progress: "I've reviewed our previous discussion."
- If last answer was incomplete: "Let's pick up where we left off..."
- If complete: "Now let's move to the next question..."
- Skip already-answered questions, focus on remaining topics.
{{else}}
Fresh start:
- After greeting, set expectation: "We'll have a conversation about your experience and technical background."
- Then begin with the first question in {{questions}}.
{{/if}}

---
CLOSING:
- Near the end, say: "Do you have any questions for me?"
- If candidate has many, answer a couple key ones.
- Always end warmly: "Thank you for your time today. We'll be in touch soon."

Remember: Your greeting has already been given via firstMessage. 
Focus on smooth, professional interviewing while maximizing the candidate's opportunity to respond fully.`
        },
      ],
    },
  };
};
