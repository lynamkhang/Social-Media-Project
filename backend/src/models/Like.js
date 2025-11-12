import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index to ensure one user can only like a post once
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

// Index for getting all likes by a user
likeSchema.index({ userId: 1, createdAt: -1 });

const Like = mongoose.model("Like", likeSchema);
export default Like;
