// routes/index.ts
import { Router } from "express";
import postRoutes from "./post.routes";
import authRoutes from "./auth.routes"; // (if you have more)
import commentRoutes from "./comment.routes";

const router = Router();

// mount each module
router.use("/posts", postRoutes);
router.use("/auth", authRoutes);
router.use("/comments", commentRoutes);

export default router;
