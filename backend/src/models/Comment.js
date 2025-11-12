const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    parentCommentId: {
      type: String,
      default: null,
      index: true, // For fetching replies
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    repliesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Creates createdAt and updatedAt
  }
);

// Indexes for performance
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ userId: 1, createdAt: -1 });
commentSchema.index({ parentCommentId: 1, createdAt: 1 }); // For nested replies

const Comment = new mongoose.model("Comment", commentSchema);
export default Comment;
