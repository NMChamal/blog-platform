import { Like, ILike } from "../models";
import { IUser } from "../models";
import { AppError } from "../middleware/errorHandler";

export const likePost = async (postId: string, user: IUser): Promise<ILike> => {
  const existingLike = await Like.findOne({ post: postId, user: user._id });
  if (existingLike) {
    throw new AppError("Post already liked", 400);
  }

  const like = new Like({ post: postId, user: user._id });
  await like.save();
  return like;
};

export const unlikePost = async (
  postId: string,
  user: IUser
): Promise<void> => {
  const like = await Like.findOneAndDelete({ post: postId, user: user._id });
  if (!like) {
    throw new AppError("Post not liked yet", 400);
  }
};

export const getLikeCountForPost = async (postId: string): Promise<number> => {
  return Like.countDocuments({ post: postId });
};

export const checkIfUserLikedPost = async (
  postId: string,
  user: IUser
): Promise<boolean> => {
  const like = await Like.findOne({ post: postId, user: user._id });
  return !!like;
};

export const getUsersWhoLikedPost = async (
  postId: string
): Promise<IUser[]> => {
  const likes = await Like.find({ post: postId }).populate("user");
  return likes.map((like) => like.user as IUser);
};
