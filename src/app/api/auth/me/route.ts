import { uploadFile } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { USER } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
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

export const PUT = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const profileLogo = formData.get("profileLogo") as File;
    const userId = await getUserId("access");
      
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    if (email) {
      const existingUser = await USER.findOne({
        email,
        _id: { $ne: userId}, 
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email already in use" },
          { status: 400 }
        );
      }
    }

      let avatarUrl = "";
      
      if (profileLogo instanceof File) {
      const arrayBuffer = await profileLogo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      avatarUrl = await uploadFile(buffer, "image", "interview-user-avatar");
      }

    const updatedUser = await USER.findByIdAndUpdate(userId,
      {
        ...(username && { username }),
        ...(email && { email }),
        ...(avatarUrl && { profileImage: avatarUrl }),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("PUT /api/user error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
};