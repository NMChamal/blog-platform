import { injectable } from "tsyringe";
import mongoose from "mongoose";
import Post, { IPost } from "../models/post.model";
import User, { IUser } from "../models/user.model";
import { AppError } from "../middleware/errorHandler";

@injectable()
export class PostService {
  public async createPost(
    postData: Partial<IPost>,
    user: IUser
  ): Promise<IPost> {
    const { title, content, status } = postData;

    if (!title || !content) {
      throw new AppError("Please provide title and content", 400);
    }

    const post = new Post({
      title,
      content,
      status: status || "draft",
      author: user._id as any,
    });

    await post.save();
    return post;
  }

  public async getPosts(options: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ posts: IPost[]; totalPages: number; currentPage: number }> {
    const { page = 1, limit = 10, search } = options;

    const query: any = { status: "published" };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      const authors = await User.find({ name: searchRegex });
      const authorIds = authors.map((author) => author._id);

      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { author: { $in: authorIds } },
      ];
    }

    const posts = await Post.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
          likeCount: { $size: "$likes" },
        },
      },
      {
        $project: {
          comments: 0,
          likes: 0,
          "author.password": 0,
          "author.email": 0,
          "author.role": 0,
          "author.createdAt": 0,
          "author.updatedAt": 0,
          "author.__v": 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    //console.log("posts " + posts);
    return { posts, totalPages, currentPage: page };
  }

  public async getPostById(id: string, user?: IUser): Promise<IPost> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid post ID", 400);
    }

    const post = await Post.findById(id).populate("author", "name _id");

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.status === "draft") {
      if (
        !user ||
        (post.author._id.toString() !== (user._id as any).toString() &&
          user.role !== "admin")
      ) {
        throw new AppError("Not authorized to view this post", 403);
      }
    }

    return post;
  }

  public async getPostsByAuthor(
    authorId: string,
    options: { page: number; limit: number }
  ): Promise<{ posts: IPost[]; totalPages: number; currentPage: number }> {
    const { page = 1, limit = 10 } = options;

    const author = await User.findById(authorId);
    if (!author) {
      throw new AppError("Author not found", 404);
    }

    const query = { author: new mongoose.Types.ObjectId(authorId) };

    const posts = await Post.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
          likeCount: { $size: "$likes" },
        },
      },
      {
        $project: {
          comments: 0,
          likes: 0,
          "author.password": 0,
          "author.email": 0,
          "author.role": 0,
          "author.createdAt": 0,
          "author.updatedAt": 0,
          "author.__v": 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return { posts, totalPages, currentPage: page };
  }

  public async getMyPosts(user: IUser, options: {
    page: number;
    limit: number;
    status: 'all' | 'draft' | 'published';
  }): Promise<{ posts: IPost[]; totalPages: number; currentPage: number }> {
    const { page = 1, limit = 10, status } = options;

    const query: any = { author: user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const posts = await Post.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
          likeCount: { $size: "$likes" },
        },
      },
      {
        $project: {
          comments: 0,
          likes: 0,
          "author.password": 0,
          "author.email": 0,
          "author.role": 0,
          "author.createdAt": 0,
          "author.updatedAt": 0,
          "author.__v": 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return { posts, totalPages, currentPage: page };
  }

  public async updatePost(
    id: string,
    postData: Partial<IPost>,
    user: IUser
  ): Promise<IPost> {
    const post = await Post.findById(id).populate("author", "_id");

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (
      post.author._id.toString() !== (user._id as any).toString() &&
      user.role !== "admin"
    ) {
      throw new AppError("Not authorized to update this post", 403);
    }

    const { title, content, status } = postData;
    if (title) post.title = title;
    if (content) post.content = content;
    if (status) post.status = status;

    await post.save();
    return post;
  }

  public async deletePost(id: string, user: IUser): Promise<void> {
    const post = await Post.findById(id).populate("author", "_id");

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (
      post.author._id.toString() !== (user._id as any).toString() &&
      user.role !== "admin"
    ) {
      throw new AppError("Not authorized to delete this post", 403);
    }

    post.deletedAt = new Date();
    await post.save();
  }
}
