import { Router } from "express";
import { uploadImages as uploadImagesController } from "../controllers/upload.controller";
import { uploadImages as uploadImagesMiddleware } from "../middleware/upload.middleware";
import { protect } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload images
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images: {
 *                 type: string,
 *                 format: 'binary'
 *               }
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 *       400:
 *         description: No files uploaded or invalid file type
 *       401:
 *         description: Not authorized
 */
router.post("/", protect, uploadImagesMiddleware, uploadImagesController);

export default router;
