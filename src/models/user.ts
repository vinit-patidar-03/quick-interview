import mongoose, { models } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: false,
        default: "user"
    }
});

const USER = models?.User || mongoose.model("User", userSchema);

export default USER;