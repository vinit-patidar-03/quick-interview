import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/session";
import USER_BOOKMARKS from "@/models/bookmarked";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } =  params;
    try {
        const userId = await getUserId("access");
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: No user ID" }, { status: 401 });
        }

        await connectDB();

        const existingBookmark = await USER_BOOKMARKS.find({ user: userId, interview: id });
        if (existingBookmark.length > 0) {
            return NextResponse.json({ error: "Bookmark already exists" }, { status: 400 });
        }

        const newBookmark = await USER_BOOKMARKS.create({ user: userId, interview: id });
        if (!newBookmark) {
            return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Interview added to bookmarks" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    try {
        const userId = await getUserId("access");
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: No user ID" }, { status: 401 });
        }

        await connectDB();

        const deletedBookmark = await USER_BOOKMARKS.findOneAndDelete({ user: userId, interview: id });
        if (!deletedBookmark) {
            return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Interview removed from bookmarks" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}