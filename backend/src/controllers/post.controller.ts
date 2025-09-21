import { Response, NextFunction } from 'express';
import { container } from "tsyringe";
import { PostService } from '../services/post.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/errorHandler';

const postService = container.resolve(PostService);

export const createPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }
    const post = await postService.createPost(req.body, req.user);
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
    const result = await postService.getPosts(options);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const post = await postService.getPostById(req.params.id, req.user);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const getPostsByAuthor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };
    const result = await postService.getPostsByAuthor(req.params.authorId, options);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }
    const { page = 1, limit = 10, status = 'all' } = req.query;
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      status: status as 'all' | 'draft' | 'published',
    };
    const result = await postService.getMyPosts(req.user, options);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }
    const post = await postService.updatePost(req.params.id, req.body, req.user);
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
    await postService.deletePost(req.params.id, req.user);
    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};