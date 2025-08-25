import { generateAccessToken, getUserId, setCookies } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const userId = await getUserId('refresh');
        console.log("userId from refresh token:", userId);
        
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const accessToken = generateAccessToken(userId);
        console.log("New access token generated:", accessToken);
        
        await setCookies("accessToken", accessToken, 3600);

        return NextResponse.json({ success: true, message: "session restored successfully" }, { status: 201 });
    } catch (error) {
        console.error("Internal server error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
