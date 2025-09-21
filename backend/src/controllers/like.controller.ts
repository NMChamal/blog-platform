import { Response, NextFunction } from 'express';
import { container } from "tsyringe";
import { LikeService } from '../services/like.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/errorHandler';

const likeService = container.resolve(LikeService);

export const toggleLike = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }
    const liked = await likeService.toggleLike(req.params.id, req.user);
    res.status(200).json({ success: true, data: { liked } });
  } catch (error) {
    next(error);
  }
};

export const getLikeCountForPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const count = await likeService.getLikeCountForPost(req.params.id);
    res.status(200).json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
};

export const checkIfUserLikedPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }
    const liked = await likeService.checkIfUserLikedPost(req.params.id, req.user);
    res.status(200).json({ success: true, data: { liked } });
  } catch (error) {
    next(error);
  }
};

export const getUsersWhoLikedPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await likeService.getUsersWhoLikedPost(req.params.id);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};