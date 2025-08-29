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
    isCompleted: {
        type: Boolean,
        default: false
    },
    totalDuration: {
        type: Number,
        required: true,
    },
    transcript: [{
        role: {
            type: String,
            enum: ['user', 'agent'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    timeRemaining: {
        type: Number,
        required: true,
        default: 0,
    },
    lastSaved: {
        type: Date,
        default: Date.now
    },
    sessionId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

userInterviewProgressSchema.index({ user: 1, interview: 1 }, { unique: true });

userInterviewProgressSchema.pre("deleteMany", async function(next) {
    const filter = this.getFilter();

    if (filter.user) {
        await mongoose.model("UserInterviewProgress").deleteMany({ user: filter.user });
    }

    if (filter.interview) {
        await mongoose.model("UserInterviewProgress").deleteMany({ interview: filter.interview });
    }

    next();
});

const USER_PROGRESS = models?.UserInterviewProgress || mongoose.model("UserInterviewProgress", userInterviewProgressSchema);

export default USER_PROGRESS;
