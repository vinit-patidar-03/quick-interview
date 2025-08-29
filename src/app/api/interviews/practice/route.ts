import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { USER_BOOKMARKS } from "@/models";
import {  NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = async () => {
  try {
    const userId = await getUserId("access");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const interviews = await USER_BOOKMARKS.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: "userinterviewprogresses",
          let: { interviewId: "$interview", userId: "$user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$interview", "$$interviewId"] },
                    { $eq: ["$user", "$$userId"] }
                  ]
                }
              }
            },
            {
              $project: { isCompleted: 1, _id: 0 }
            }
          ],
          as: "progress"
        }
      },
      {
        $lookup: {
          from: "interviews",
          localField: "interview",
          foreignField: "_id",
          as: "interviewDetails"
        }
      },
      { $unwind: "$interviewDetails" },
      {
  $addFields: {
    isCompleted: { 
      $ifNull: [{ $arrayElemAt: ["$progress.isCompleted", 0] }, false] 
    },
    isStarted: { 
      $cond: { 
        if: { $gt: [{ $size: { $ifNull: ["$progress", []] } }, 0] }, 
        then: true, 
        else: false 
      } 
    }
  }
},
      {
        $project: {
          _id: 1,
          interview: "$interviewDetails",
          isCompleted: 1,
          isStarted: 1,
          createdAt: 1
        }
      }
    ]);

    if (!interviews || interviews.length === 0) {
      return NextResponse.json({ success: false, error: "No interview found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: interviews }, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
};
// export const DELETE = (req: NextRequest) => {
// }

// export const PUT = (req: NextRequest) => {
// }