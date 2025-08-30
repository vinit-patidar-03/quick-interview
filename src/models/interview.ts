import { Interview } from "@/types/types";
import mongoose, { models } from "mongoose";
import USER_BOOKMARKS from "./bookmarked-interviews";

const interviewSchema = new mongoose.Schema<Interview>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    technologies: {
        type: [String],
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    questions: {
        type: [{
            question: { type: String, required: true },
            type: { type: String },
            followups: { type: [String], default: [] },
            hints: { type: [String], default: [] }
        }],
        required: false,
    },
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

interviewSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
    await USER_BOOKMARKS.deleteMany({ interview: this._id });
    next();
});

const INTERVIEW_MODEL = models?.Interview || mongoose.model("Interview", interviewSchema);

export default INTERVIEW_MODEL;
