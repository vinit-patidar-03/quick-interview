import { getUserId } from "@/lib/session";
import USER_BOOKMARKS from "@/models/bookmarked";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const userId = await getUserId("access");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const interviews = await USER_BOOKMARKS.find({ user: userId }).populate("interview");

    if (!interviews || interviews.length === 0) {
      return NextResponse.json({ success: false, error: "No interview found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: interviews }, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
};
export const DELETE = (req: NextRequest) => {
}

export const PUT = (req: NextRequest) => {
}