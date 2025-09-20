import { Router } from 'express';
import { likePost, unlikePost, getLikeCountForPost, checkIfUserLikedPost, getUsersWhoLikedPost } from '../controllers/like.controller';
import { protect } from '../middleware/auth.middleware';

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
 *     summary: Like a post
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
 *       201:
 *         description: Post liked successfully
 *       400:
 *         description: Post already liked
 *       401:
 *         description: Not authorized
 */
router.post('/like', protect, likePost);

/**
 * @swagger
 * /api/posts/{id}/like:
 *   delete:
 *     summary: Unlike a post
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
 *       204:
 *         description: Post unliked successfully
 *       400:
 *         description: Post not liked yet
 *       401:
 *         description: Not authorized
 */
router.delete('/like', protect, unlikePost);

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
router.get('/likes/count', getLikeCountForPost);

/**
 * @swagger
 * /api/posts/{id}/like:
 *   get:
 *     summary: Check if current user liked a post
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
 *         description: Liked status
 *       401:
 *         description: Not authorized
 */
router.get('/like', protect, checkIfUserLikedPost);

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
router.get('/likes', getUsersWhoLikedPost);

export default router;
