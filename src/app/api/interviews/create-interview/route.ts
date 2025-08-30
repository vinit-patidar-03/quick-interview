import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/session";
import { connectDB } from "@/lib/db";
import { INTERVIEW_MODEL } from "@/models";

export const POST = async (req: NextRequest) => {
  try {

    const userId = await getUserId("access");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: No user ID" }, { status: 401 });
    }

    const formData = await req.formData();

    const company = formData.get("company") as string;
    const role = formData.get("role") as string;
    const technologies = JSON.parse(formData.get("technologies") as string);
    const difficulty = formData.get("difficulty") as string;
    const duration = Number(formData.get("duration"));
    const questions = JSON.parse(formData.get("questions") as string);
    const description = formData.get("description") as string;

    await connectDB();

    if (!company || !role || !technologies || !difficulty || !duration || !questions || !description) {
      return NextResponse.json({ success: false, message: "Missing required field" });
    }

    const interview = await INTERVIEW_MODEL.create({
      company,
      role,
      technologies,
      difficulty,
      duration,
      questions,
      description,
      userId: userId,
    });

    return NextResponse.json({ success: true, data: interview }, { status: 200 });
  } catch (error) {
    console.error("Error creating interview", error);
    return NextResponse.json({ error: "Failed to create interview" }, { status: 500 });
  }
};