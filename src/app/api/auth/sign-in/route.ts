import {USER} from "@/models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { generateAccessToken, generateRefreshToken, setCookies } from "@/lib/session";



export const POST = async (req: NextRequest) => {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        const user = await USER.findOne({ email });

        if (!user) {
            return NextResponse.json({success: false, message: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await setCookies("accessToken", accessToken, 3600);
        await setCookies("refreshToken", refreshToken, 604800);

        return NextResponse.json({ success: true, data: user?._id }, { status: 200 });

    } catch (error) {
        console.error("Error logging in user:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}