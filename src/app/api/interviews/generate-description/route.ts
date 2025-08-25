import { generateDescription } from "@/lib/generateDescription";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { company, role, difficulty, technologies } = await req.json();

        if (!company || !role || !difficulty || !technologies) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const description = await generateDescription({ company, role, difficulty, technologies });
        return NextResponse.json({ success: true, description });
    } catch (error) {
        console.error("Error generating description", error);
        return NextResponse.json({ success: false, error: "Failed to generate description" }, { status: 500 });
    }
}