import express from "express";
import { authMe, getUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/profeile/:identifier", getUserProfile);

export default router;
