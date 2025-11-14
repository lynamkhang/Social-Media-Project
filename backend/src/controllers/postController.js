import Post from "../models/Post.js";
import PostMedia from "../models/PostMedia.js";
import cloudinary from "../libs/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { caption, location, tags, visibility } = req.body;
    const userId = req.user._id;

    // Check if post is not empty
    if (
      (!caption || caption.trim() === "") &&
      (!req.files || req.files.length === 0)
    ) {
      return res.status(400).json({
        message: "Bài đăng ít nhất phải có caption, image hoặc video",
      });
    }

    // Upload files to Cloudinary
    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "social_media_posts",
        resource_type: "auto",
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Determine media type
    const mediaTypes = uploadResults.map((result) => result.resource_type);
    const hasImage = mediaTypes.includes("image");
    const hasVideo = mediaTypes.includes("video");
    let mediaType = "image";
    if (hasImage && hasVideo) mediaType = "mixed";
    else if (hasVideo) mediaType = "video";

    // Create post
    const newPost = new Post({
      userId,
      caption,
      mediaUrls: uploadResults.map((result) => result.secure_url),
      mediaType,
      location,
      tags,
      visibility: visibility || "pulic",
    });

    await newPost.save();

    // Create PostMedia entries for each uploaded file
    const mediaEntries = uploadResults.map((result, index) => ({
      postId: newPost._id,
      mediaUrl: result.secure_url,
      mediaType: result.resource_type,
      order: index,
      metadata: {
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        duration: result.duration || null,
      },
    }));

    await PostMedia.insertMany(mediaEntries);

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.log("Error when create post", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { caption, location, tags, visibility } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    if (post.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền chỉnh sửa bài đăng" });
    }

    if (caption !== undefined) post.caption = caption;
    if (location !== undefined) post.location = location;
    if (tags !== undefined) post.tags = tags;
    if (visibility !== undefined) post.visibility = visibility;

    await post.save();

    return res
      .status(200)
      .json({ message: "Đã chỉnh sửa bài đăng thành công", post });
  } catch (error) {
    console.log("Error when update post", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    if (post.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa bài đăng" });
    }

    const mediaEntries = await PostMedia.find({ postId });

    const deletePromises = mediaEntries.map((media) => {
      const publicId = media.metadata.publicId;
      return cloudinary.uploader.destroy(publicId, {
        resource_type: media.mediaType,
      });
    });

    await Promise.all(deletePromises);

    await PostMedia.deleteMany({ postId });

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Đã xóa bài đăng thành công" });
  } catch (error) {
    console.log("Error when delete post", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const getPosts = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error when get post", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const getPostById = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error when get post by id", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const getPostByUserId = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error when get post by userId", error);
    return res.status(500).json({ message: "System error" });
  }
};
