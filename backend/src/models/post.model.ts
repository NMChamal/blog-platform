
import mongoose, { Schema, Document, Query } from 'mongoose';
import { IUser } from './user.model';

export interface IPost extends Document {
  title: string;
  content: string;
  author: IUser;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

PostSchema.index({ title: 'text', content: 'text' });
PostSchema.index({ status: 1 });
PostSchema.index({ author: 1 });
PostSchema.index({ author: 1, status: 1 });
PostSchema.index({ createdAt: -1 });

PostSchema.pre<Query<IPost, any>>(/^find/, function (next) {
  this.where({ deletedAt: null });
  next();
});

export default mongoose.model<IPost>('Post', PostSchema);
