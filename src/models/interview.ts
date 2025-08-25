import { Interview } from "@/types/types";
import mongoose, { models } from "mongoose";

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
            question: {
                type: String,
                required: true,
            },
            type: {
                type: String,
            },
            followups: {
                type: [String], 
                required: false,
                default: [],
            },
            hints: {
                type: [String], 
                required: false,
                default: [],
            }
        }],
        required: false,
    },
    rating: {
        type: Number,
        default: 0,
        required: false,
    },
    attempts: {
        type: Number,
        default: 0,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    companyLogo: {
        type: String,
        required: false,
    },
    trending: {
        type: Boolean,
        required: false,
    },
    recentlyAdded: {
        type: Boolean,
        required: false,
    },
}, {
    timestamps: true,
});

const INTERVIEW_MODEL = models.Interview || mongoose.model("Interview", interviewSchema);

export default INTERVIEW_MODEL;
