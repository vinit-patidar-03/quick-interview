import mongoose, { Schema, models } from "mongoose";

const bookmarkedSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
  },
  { timestamps: true }
);

bookmarkedSchema.index({ user: 1, interview: 1 }, { unique: true });

bookmarkedSchema.pre("deleteMany", async function (next) {
  const filter = this.getFilter();
  if (filter.user) {
    await mongoose.model("UserBookmarks").deleteMany({ user: filter.user });
  }
  if (filter.interview) {
    await mongoose.model("UserBookmarks").deleteMany({ interview: filter.interview });
  }
  next();
});

const USER_BOOKMARKS =
  models?.UserBookmarks || mongoose.model("UserBookmarks", bookmarkedSchema);

export default USER_BOOKMARKS;
