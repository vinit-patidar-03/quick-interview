import mongoose, { model, models, Schema } from "mongoose";

const feedBackSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview"
    },
    feedback: {
        type: Object,
        required: true
    }
}, {
    timestamps: true
});

feedBackSchema.pre("deleteMany", async function(next) {
    const filter = this.getFilter();

    if (filter.user) {
        await mongoose.model("UserInterviewFeedback").deleteMany({ user: filter.user });
    }

    if (filter.interview) {
        await mongoose.model("UserInterviewFeedback").deleteMany({ interview: filter.interview });
    }

    next();
});

const UserInterviewFeedback = models?.UserInterviewFeedback || model('UserInterviewFeedback', feedBackSchema);

export default UserInterviewFeedback;
