import express from "express";
import {
  createPost,
  deletePost,
  updatePost,
  getPosts,
} from "../controllers/postController";

const router = express.Router();

router.post("/posts", createPost);

router.put("/posts/:postId/update", updatePost);

router.delete("/post/:postId/delete", deletePost);

router.get("/posts", getPosts);

export default router;
