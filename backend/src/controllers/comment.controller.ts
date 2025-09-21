import { Response, NextFunction } from "express";
import { container } from "tsyringe";
import { CommentService } from "../services/comment.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/errorHandler";

const commentService = container.resolve(CommentService);

export const createComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }
    const commentData = { ...req.body, post: req.params.id };
    const comment = await commentService.createComment(commentData, req.user);
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = await commentService.getCommentsByPost(req.params.id);
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }
    const { content } = req.body;
    const comment = await commentService.updateComment(
      req.params.commentId,
      content,
      req.user
    );
    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }
    await commentService.deleteComment(req.params.commentId, req.user);
    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
