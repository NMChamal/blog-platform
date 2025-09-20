
import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PostSchema.index({ title: 'text', content: 'text' });

PostSchema.pre<IPost>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IPost>('Post', PostSchema);
