import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    caption: {
      type: String,
      default: "",
    },
    mediaUrls: {
      type: [String],
      default: [],
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "mixed"],
      required: true,
    },
    location: {
      type: Object,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "friends"],
      default: "public",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // This creates createdAt and updatedAt automatically
  }
);

// Indexes for performance
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ visibility: 1, createdAt: -1 });

const Post = new mongoose.model("Post", postSchema);
export default Post;
