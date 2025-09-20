
import { Response, NextFunction } from 'express';
import * as PostService from '../services/post.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/errorHandler';

export const createPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }
    const post = await PostService.createPost(req.body, req.user);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      search: search as string,
    };
    const result = await PostService.getPosts(options);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const post = await PostService.getPostById(req.params.id, req.user);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }
    const post = await PostService.updatePost(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }
    await PostService.deletePost(req.params.id, req.user);
    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
