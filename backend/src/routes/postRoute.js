import express from "express";
import {
  createPost,
  deletePost,
  updatePost,
  getPosts,
} from "../controllers/postController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Create post with multiple file uploads (max 10 files)
router.post("/", upload.array("media", 10), createPost);

router.put("/:postId/update", updatePost);

router.delete("/:postId/delete", deletePost);

router.get("/", getPosts);

export default router;
