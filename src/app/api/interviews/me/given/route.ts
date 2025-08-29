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
      from: "userinterviewprogresses",
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
        { $project: { isCompleted: 1, _id: 0 } },
      ],
      as: "progressInfo",
    },
    },
  {
      $lookup: {
        from: "userinterviewfeedbacks",
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
          { $project: { _id: 1 } },
        ],
        as: "feedback",
      },
    },
  {
    $addFields: {
      isCompleted: {
        $ifNull: [{ $arrayElemAt: ["$progressInfo.isCompleted", 0] }, false],
      },
      isStarted: {
        $cond: {
          if: { $gt: [{ $size: "$progressInfo" }, 0] },
          then: true,
          else: false,
        },
      },
      isFeedback: { $gt: [{ $size: "$feedback" }, 0] },
    },
  },
  { $match: { isCompleted: true } },
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
