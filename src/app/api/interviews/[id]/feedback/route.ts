import { connectDB } from "@/lib/db";
import { generateFeedback } from "@/lib/generateDescription";
import { getUserId } from "@/lib/session";
import { USER_PROGRESS } from "@/models";
import UserInterviewFeedback from "@/models/user-interview-feedback";
import { NextResponse } from "next/server";

export const  GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const userId = await getUserId("access");
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const interviewId = params.id;

    if (!interviewId) {
      return NextResponse.json(
        { error: "interview ID undefined" },
        { status: 404 }
      );
    }

    await connectDB();

    const interviewFeedback = await UserInterviewFeedback.findOne({
      user: userId,
      interview: interviewId,
    }).populate('interview');

    if (!interviewFeedback) {
      return NextResponse.json(
        { error: "feedback for interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: interviewFeedback },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting feedback:", error);
    return NextResponse.json(
      { error: "Failed to get feedback" },
      { status: 500 }
    );
  }
}

export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const userId = await getUserId("access");
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const interviewId = params.id;

    await connectDB();

    const interviewProgress = await USER_PROGRESS.findOne({
      user: userId,
      interview: interviewId,
    });

    if (!interviewProgress) {
      return NextResponse.json(
        { error: "progress for interview not found" },
        { status: 404 }
      );
    }

    const transcript = interviewProgress.transcript;
    if (!transcript) {
      return NextResponse.json({ error: "No interview transcript found" });
    }

    const formattedTranscript = transcript
      .map((t: {role: string, content: string}) => `${t.role}: ${t.content}`)
      .join("\n");

    const feedback = await generateFeedback(formattedTranscript);

    if (!feedback) {
      return NextResponse.json(
        { error: "error generating feedback" },
        { status: 500 }
      );
    }

    await UserInterviewFeedback.create({
      user: userId,
      interview: interviewId,
      feedback
    });

    return NextResponse.json({ success: true, data: feedback }, { status: 200 });
  } catch (error) {
    console.error("Error generating feedback:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
