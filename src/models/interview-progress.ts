import mongoose, { Schema, models } from "mongoose";

const userInterviewProgressSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true,
    },
    isCompleted: Boolean,
    answers: [{
        questionId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        answer: String
    }],
    duration: {
        type: Number,
        required: true,
        default: 0,
    },
});

userInterviewProgressSchema.index({ user: 1, interview: 1 }, { unique: true });

const USER_PROGRESS = models?.UserInterviewProgress || mongoose.model("UserInterviewProgress", userInterviewProgressSchema);
export default USER_PROGRESS;
