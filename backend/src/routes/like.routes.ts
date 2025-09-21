import { Router } from "express";
import {
  toggleLike,
  getLikeCountForPost,
  checkIfUserLikedPost,
  getUsersWhoLikedPost,
} from "../controllers/like.controller";
import { protect, optionalAuth } from "../middleware/auth.middleware";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Like management
 */

/**
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: Toggle like on a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like status toggled successfully
 *       401:
 *         description: Not authorized
 */
router.post("/like", protect, toggleLike);

/**
 * @swagger
 * /api/posts/{id}/likes/count:
 *   get:
 *     summary: Get like count for a post
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like count
 */
router.get("/likes/count", getLikeCountForPost);

/**
 * @swagger
 * /api/posts/{id}/like:
 *   get:
 *     summary: Check if current user liked a post
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liked status
 *       401:
 *         description: Not authorized
 */
router.get("/like", optionalAuth, checkIfUserLikedPost);

/**
 * @swagger
 * /api/posts/{id}/likes:
 *   get:
 *     summary: Get all users who liked a post
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get("/likes", optionalAuth, getUsersWhoLikedPost);

export default router;
