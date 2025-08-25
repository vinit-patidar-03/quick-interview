import {generateQuestionsWithRetry} from "@/lib/generateQuestions";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { company, role, difficulty, technologies, duration, description } = await req.json();

        if (!company || !role || !difficulty || !technologies || !duration || !description) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const params = {
            company, role, difficulty, technologies, duration, description
        }
 
        const questions = await generateQuestionsWithRetry(params, 3);
        return NextResponse.json({ success: true, questions: questions});
    } catch (error) {
        console.error("Error generating questions", error);
        return NextResponse.json({ success: false, error: "Failed to generate questions" }, { status: 500 });
    }
}