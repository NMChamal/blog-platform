import { injectable } from "tsyringe";
import Comment, { IComment } from "../models/comment.model";
import { IUser } from "../models/user.model";
import { AppError } from "../middleware/errorHandler";

@injectable()
export class CommentService {
  public async createComment(
    commentData: Partial<IComment>,
    user: IUser
  ): Promise<IComment> {
    const { post, content, parent } = commentData;

    if (!post || !content) {
      throw new AppError("Please provide post and content", 400);
    }

    const comment = new Comment({
      post,
      content,
      parent,
      user: user._id,
    });

    await comment.save();
    return comment.populate("user", "name _id");
  }

  public async getCommentsByPost(postId: string): Promise<any[]> {
    const comments = await Comment.find({
      post: postId,
      withDeleted: true,
    }).populate("user", "name _id");

    const commentsById: { [key: string]: any } = {};
    comments.forEach((comment: IComment) => {
      if (comment.deletedAt) {
        commentsById[(comment._id as any).toString()] = {
          ...comment.toObject(),
          user: { _id: null, name: "[Deleted]" },
          content: "This comment has been deleted by user.",
        };
      } else {
        commentsById[(comment._id as any).toString()] = comment.toObject();
      }
    });

    const nestedComments: any[] = [];
    comments.forEach((comment: IComment) => {
      if (comment.parent) {
        const parent = commentsById[comment.parent.toString()];
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(commentsById[(comment._id as any).toString()]);
        }
      } else {
        nestedComments.push(commentsById[(comment._id as any).toString()]);
      }
    });

    return nestedComments;
  }

  public async updateComment(
    commentId: string,
    content: string,
    user: IUser
  ): Promise<IComment> {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (
      comment.user.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      throw new AppError("Not authorized to update this comment", 403);
    }

    comment.content = content;
    await comment.save();
    return comment.populate("user", "name _id");
  }

  public async deleteComment(commentId: string, user: IUser): Promise<void> {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (
      comment.user.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      throw new AppError("Not authorized to delete this comment", 403);
    }

    comment.deletedAt = new Date();
    await comment.save();
  }
}
