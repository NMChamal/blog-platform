import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface ILike extends Document {
  user: mongoose.Types.ObjectId | IUser;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  createdAt: { type: Date, default: Date.now },
});

LikeSchema.index({ user: 1, post: 1 }, { unique: true });

export default mongoose.model<ILike>("Like", LikeSchema);
