import USER from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { generateAccessToken, generateRefreshToken, setCookies } from "@/lib/session";



export const POST = async (req: NextRequest) => {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const user = await USER.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await setCookies("accessToken", accessToken, 3600);
        await setCookies("refreshToken", refreshToken, 604800);

        return NextResponse.json({ success: true, data: user?._id }, { status: 200 });

    } catch (error) {
        console.error("Error logging in user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}