import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/session";
import {INTERVIEW_MODEL} from "@/models";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async () => {
  try {
    const userId = await getUserId("access");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: No user ID" },
        { status: 401 }
      );
    }

    await connectDB();
    
    const interviews = await INTERVIEW_MODEL.aggregate([
      {
        $lookup: {
          from: "userbookmarks",
          let: { interviewId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$interview", "$$interviewId"] },
                    { $eq: ["$user", new mongoose.Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: "bookmarkInfo",
        },
      },
      {
        $addFields: {
          isBookmarked: { $gt: [{ $size: "$bookmarkInfo" }, 0] },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
      
      if (!interviews) {
          return NextResponse.json({ error: "No interviews found" }, { status: 404 });
      }
        return NextResponse.json({ success: true, data: interviews }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
};
