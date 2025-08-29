import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {USER} from "@/models";
import { connectDB } from "@/lib/db";

export const POST = async (req: NextRequest) => {
    try {
        const { username, email, password } = await req.json();

        await connectDB();

        if (!username || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await USER.create({ username, email, password: hashedPassword });

        return NextResponse.json({ success: true, message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error signing up user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}