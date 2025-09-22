import { useParams, Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import DOMPurify from "dompurify";
import useAuthStore from "../store/auth.store";
import { useState } from "react";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import Comment from "../components/Comment";
import { formatTimeAgo } from "../utils/date";
import Error from "../components/Error";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, userId } = useAuthStore();
  const {
    data: postData,
    error: postError,
    isLoading: postIsLoading,
    mutate: mutatePost,
  } = useApi(`/api/posts/${id}`);
  const {
    data: likeData,
    error: likeError,
    isLoading: likeIsLoading,
    mutate: mutateLike,
  } = useApi(isAuthenticated ? `/api/posts/${id}/like` : null);
  const {
    data: likeCountData,
    error: likeCountError,
    isLoading: likeCountIsLoading,
    mutate: mutateLikeCount,
  } = useApi(`/api/posts/${id}/likes/count`);
  const {
    data: commentsData,
    error: commentsError,
    isLoading: commentsIsLoading,
    mutate: mutateComments,
  } = useApi(`/api/posts/${id}/comments`);
  const { post: toggleLike } = useApi(`/api/posts/${id}/like`);
  const { post: postComment } = useApi(`/api/posts/${id}/comments`);
  const [message, setMessage] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");

  if (postIsLoading || likeIsLoading || likeCountIsLoading || commentsIsLoading)
    return <div>Loading...</div>;
  if (postError) {
    if (postError.status === 404) {
      return <Error message="Post not found" />;
    }
    return <Error message="Error loading post" />;
  }
  if (likeError || likeCountError || commentsError)
    return <Error message="Error loading post" />;

  const sanitizedContent = DOMPurify.sanitize(
    postData.data.content.replace(
      /src="\/uploads/g,
      `src="${import.meta.env.VITE_API_BASE_URL}/uploads`
    )
  );

  const handleLike = async () => {
    if (!isAuthenticated) {
      setMessage("You must be logged in to like a post.");
      return;
    }
    await toggleLike({});
    mutateLike();
    mutateLikeCount();
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      setMessage("Comment cannot be empty.");
      return;
    }
    if (!isAuthenticated) {
      setMessage("You must be logged in to comment.");
      return;
    }
    await postComment({ content: commentContent });
    setCommentContent("");
    mutateComments();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">{postData.data.title}</h1>
        {userId === postData.data.author._id && (
          <Link
            to={`/posts/${id}/edit`}
            className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Edit Post
          </Link>
        )}
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Link
          to={`/author/${postData.data.author._id}`}
          className="text-indigo-600 hover:underline"
        >
          by {postData.data.author.name}
        </Link>
        <span>-</span>
        <span>{formatTimeAgo(postData.data.createdAt)}</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={handleLike}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
        >
          {likeData?.data.liked ? (
            <HeartIconSolid className="w-6 h-6 text-red-500" />
          ) : (
            <HeartIconOutline className="w-6 h-6" />
          )}
          <span>{likeCountData.data.count}</span>
        </button>
      </div>
      {message && <p className="text-red-500 text-sm mt-2">{message}</p>}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p>You must be logged in to comment.</p>
        )}
        <div className="space-y-4">
          {commentsData.data.length > 0 ? (
            commentsData.data.map((comment: any) => (
              <Comment
                key={comment._id}
                comment={comment}
                postId={id!}
                mutateComments={mutateComments}
              />
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
