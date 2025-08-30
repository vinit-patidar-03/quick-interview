import {generateQuestionsWithRetry} from "@/lib/generateQuestions";
import { Difficulty } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.formData();
        const company = data.get('company') as string;
        const role = data.get('role') as string;
        const difficulty = data.get('difficulty') as Difficulty;
        const technologies = JSON.parse(data.get('technologies') as string);
        const duration = Number(data.get('duration'));
        const description = data.get('description') as string;
        const Resume = data.get('Resume') as File;

        if (!company || !role || !difficulty || !technologies || !duration || !description) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const params = {
            company, role, difficulty, technologies, duration, description, Resume
        }
 
        const questions = await generateQuestionsWithRetry(params, 3);
        return NextResponse.json({ success: true, questions: questions});
    } catch (error) {
        console.error("Error generating questions", error);
        return NextResponse.json({ success: false, error: "Failed to generate questions" }, { status: 500 });
    }
}