import mongoose from "mongoose";

const postMediaSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      index: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Object,
      default: {}, // Can store width, height, duration, thumbnail, etc.
    },
  },
  {
    timestamps: true,
  }
);

// Index for retrieving media in order
postMediaSchema.index({ postId: 1, order: 1 });

const PostMedia = new mongoose.model("PostMedia", postMediaSchema);
export default PostMedia;
