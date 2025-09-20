import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  parent?: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  deletedAt?: Date;
}

const CommentSchema: Schema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Comment" },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

// CommentSchema.pre<any>(/^find/, function (next) {
//   this.where({ deletedAt: null });
//   next();
// });

CommentSchema.pre(/^find/, function (next) {
  const query = this as mongoose.Query<any, any>;
  if (!query.getFilter().withDeleted) {
    query.where({ deletedAt: null });
  } else {
    // remove it so it doesn't conflict
    const filter = query.getFilter();
    delete filter.withDeleted;
    query.setQuery(filter);
  }
  next();
});

export default mongoose.model<IComment>("Comment", CommentSchema);
