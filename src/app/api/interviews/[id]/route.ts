import { getUserId } from "@/lib/session";
import { INTERVIEW_MODEL } from "@/models";
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

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await  params;
    try {
        const userId = await getUserId("access");
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await INTERVIEW_MODEL.findByIdAndDelete(id);
       

        return NextResponse.json({ success: true, message: "Interview deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching interview:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}