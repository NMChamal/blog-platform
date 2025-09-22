import { Link } from "react-router-dom";
import parse, { Element } from 'html-react-parser';
import { HeartIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { formatTimeAgo } from "../utils/date";
import CenteredImage from './CenteredImage';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    author: {
      name: string;
    };
    likeCount: number;
    commentCount: number;
    createdAt: string;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const options = {
    replace: (domNode: any) => {
      if (domNode instanceof Element && domNode.attribs && domNode.name === 'img') {
        const { src, alt } = domNode.attribs;
        return <CenteredImage src={src} alt={alt} />;
      }
    },
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm h-48 flex flex-col transition-transform duration-200 transform hover:scale-105">
      <h2 className="text-xl font-bold">{post.title}</h2>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span>by {post.author.name}</span>
        <span>-</span>
        <span>{formatTimeAgo(post.createdAt)}</span>
      </div>
      <div className="mt-2 flex-grow h-24 overflow-hidden">{parse(post.content.replace(/src="\/uploads/g, `src="${import.meta.env.VITE_API_BASE_URL}/uploads`).substring(0, 100), options)}...</div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-600">
            <HeartIcon className="w-5 h-5" />
            <span>{post.likeCount}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
            <span>{post.commentCount}</span>
          </div>
        </div>
        <Link to={`/posts/${post._id}`} className="text-indigo-600 hover:underline self-end">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
