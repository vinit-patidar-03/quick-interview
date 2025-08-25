import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/session";
import USER from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const userId = await getUserId('access');

        if (!userId) {
            return NextResponse.json({ success: false, message: "unauthorized" }, { status: 401 });
        }

        await connectDB();

        const user = await USER.findById(userId).select("-password");

        if (!user) {
            return NextResponse.json({ success: false, message: "user doesn't exists" }, { status: 401 });
        }

        return NextResponse.json({ success: true, message: "User fetched Succcessfully", data: user }, { status: 200 });
    } catch (error) {
        console.error(error);
    }
}