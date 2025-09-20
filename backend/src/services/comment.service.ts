import { Comment, IComment } from "../models";
import { IUser } from "../models";
import { AppError } from "../middleware/errorHandler";

export const createComment = async (
  commentData: Partial<IComment>,
  user: IUser
): Promise<IComment> => {
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
  return comment.populate("user", "name");
};

export const getCommentsByPost = async (
  postId: string
): Promise<IComment[]> => {
  const comments = await Comment.find({ post: postId }).populate(
    "user",
    "name"
  );

  // Transform deleted comments
  return comments.map((comment: any) => {
    if (comment.deletedAt) {
      return {
        ...comment.toObject(),
        user: { _id: null, name: "Deleted User" },
        content: "This comment has been deleted.",
      };
    }
    return comment;
  });
};

export const updateComment = async (
  commentId: string,
  content: string,
  user: IUser
): Promise<IComment> => {
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
  return comment.populate("user", "name");
};

export const deleteComment = async (
  commentId: string,
  user: IUser
): Promise<void> => {
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
};
