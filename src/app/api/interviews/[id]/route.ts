import { getUserId } from "@/lib/session";
import INTERVIEW_MODEL from "@/models/interview";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } =  params;
    try {
        const userId = await getUserId("access");
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const interview = await INTERVIEW_MODEL.findById(id);
        if (!interview) {
            return NextResponse.json({ error: "Interview not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: interview }, { status: 200 });
    } catch (error) {
        console.error("Error fetching interview:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export const DELETE = (req: NextRequest) => {
}

export const PUT = (req: NextRequest) => {
}