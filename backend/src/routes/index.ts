// routes/index.ts
import { Router } from "express";
import postRoutes from "./post.routes";
import authRoutes from "./auth.routes"; // (if you have more)
import commentRoutes from "./comment.routes";
import likeRoutes from "./like.routes";

const router = Router();

// mount each module
router.use("/posts", postRoutes);
router.use("/auth", authRoutes);
router.use("/comments", commentRoutes);
router.use("/likes", likeRoutes);

export default router;
