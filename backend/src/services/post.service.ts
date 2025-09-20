
import Post, { IPost } from '../models/post.model';
import { IUser } from '../models/user.model';
import { AppError } from '../middleware/errorHandler';

export const createPost = async (postData: Partial<IPost>, user: IUser): Promise<IPost> => {
  const { title, content, status } = postData;

  if (!title || !content) {
    throw new AppError('Please provide title and content', 400);
  }

  const post = new Post({
    title,
    content,
    status: status || 'draft',
    author: user._id,
  });

  await post.save();
  return post;
};

export const getPosts = async (options: { page: number; limit: number; search?: string }): Promise<{ posts: IPost[], totalPages: number, currentPage: number }> => {
  const { page = 1, limit = 10, search } = options;

  const query: any = { status: 'published' };
  if (search) {
    query.$text = { $search: search };
  }

  const posts = await Post.find(query)
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Post.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  return { posts, totalPages, currentPage: page };
};

export const getPostById = async (id: string, user?: IUser): Promise<IPost> => {
  const post = await Post.findById(id).populate('author', 'name');

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.status === 'draft') {
    if (!user || (post.author.toString() !== user._id.toString() && user.role !== 'admin')) {
      throw new AppError('Not authorized to view this post', 403);
    }
  }

  return post;
};

export const updatePost = async (id: string, postData: Partial<IPost>, user: IUser): Promise<IPost> => {
  const post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.author.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new AppError('Not authorized to update this post', 403);
  }

  const { title, content, status } = postData;
  if (title) post.title = title;
  if (content) post.content = content;
  if (status) post.status = status;

  await post.save();
  return post;
};

export const deletePost = async (id: string, user: IUser): Promise<void> => {
  const post = await Post.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.author.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new AppError('Not authorized to delete this post', 403);
  }

  await post.deleteOne();
};
