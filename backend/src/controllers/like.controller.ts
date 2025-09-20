import { Response, NextFunction } from 'express';
import * as LikeService from '../services/like.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/errorHandler';

export const likePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }
    const like = await LikeService.likePost(req.params.id, req.user);
    res.status(201).json({ success: true, data: like });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }
    await LikeService.unlikePost(req.params.id, req.user);
    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

export const getLikeCountForPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const count = await LikeService.getLikeCountForPost(req.params.id);
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
    const liked = await LikeService.checkIfUserLikedPost(req.params.id, req.user);
    res.status(200).json({ success: true, data: { liked } });
  } catch (error) {
    next(error);
  }
};

export const getUsersWhoLikedPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await LikeService.getUsersWhoLikedPost(req.params.id);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
