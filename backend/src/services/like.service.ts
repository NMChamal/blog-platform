import { injectable } from "tsyringe";
import mongoose from "mongoose";
import Like, { ILike } from "../models/like.model";
import { IUser } from "../models/user.model";

@injectable()
export class LikeService {
  public async toggleLike(postId: string, user: IUser): Promise<boolean> {
    const existingLike = await Like.findOne({ post: new mongoose.Types.ObjectId(postId), user: user._id as any });

    if (existingLike) {
      await existingLike.deleteOne();
      return false; // unliked
    } else {
      const like = new Like({ post: new mongoose.Types.ObjectId(postId), user: user._id as any });
      await like.save();
      return true; // liked
    }
  }

  public async getLikeCountForPost(postId: string): Promise<number> {
    return Like.countDocuments({ post: new mongoose.Types.ObjectId(postId) });
  }

  public async checkIfUserLikedPost(
    postId: string,
    user: IUser | undefined
  ): Promise<boolean> {
    if (!user) {
      return false;
    }
    const like = await Like.findOne({ post: new mongoose.Types.ObjectId(postId), user: user._id as any });
    return !!like;
  }

  public async getUsersWhoLikedPost(postId: string): Promise<IUser[]> {
    const likes = await Like.find({ post: new mongoose.Types.ObjectId(postId) }).populate("user");
    return likes.map((like) => like.user as any);
  }
}
