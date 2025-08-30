import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export const POST = async () => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');
        return NextResponse.json({success: true, message: "logged out successfully"},{status: 200});
    } catch (error) {
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}