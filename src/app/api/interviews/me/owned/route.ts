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
    $match: { userId: new mongoose.Types.ObjectId(userId) }
  },
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
        {
          $project: {
            _id: 0,
            isCompleted: 1,
          },
        },
      ],
      as: "progress",
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
      isStarted: { $gt: [{ $size: "$progress" }, 0] },
      isCompleted: {
        $cond: [
          { $gt: [{ $size: "$progress" }, 0] },
          { $arrayElemAt: ["$progress.isCompleted", 0] },
          false,
        ],
      },
      isFeedback: { $gt: [{ $size: "$feedback" }, 0] },
    },
  },
  { $project: { progress: 0, feedback: 0 } },
]);


      
      if (!interviews) {
          return NextResponse.json({ error: "No interviews found" }, { status: 404 });
      }
        return NextResponse.json({ success: true, data: interviews }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
};
