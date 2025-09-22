import { useState } from "react";
import parse from "html-react-parser";
import { useApi } from "../hooks/useApi";
import { useDeleteApi } from "../hooks/useDeleteApi";
import useAuthStore from "../store/auth.store";
import { formatTimeAgo } from "../utils/date";

interface CommentProps {
  comment: {
    _id: string;
    content: string;
    user: {
      _id: string;
      name: string;
    };
    createdAt: string;
    children: CommentProps["comment"][];
  };
  postId: string;
  mutateComments: () => void;
}

const Comment = ({ comment, postId, mutateComments }: CommentProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);
  const { post } = useApi(`/api/posts/${postId}/comments`);
  const { put } = useApi(`/api/comments/${comment._id}`);
  const { del } = useDeleteApi(`/api/comments/${comment._id}`);
  const { isAuthenticated, userId, role } = useAuthStore();

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    await post({ content: replyContent, parent: comment._id });
    setReplyContent("");
    setShowReplyForm(false);
    mutateComments();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    await put({ content: editContent });
    setShowEditForm(false);
    mutateComments();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await del();
      mutateComments();
    }
  };

  const isDeleted = comment.user.name === "Deleted User";

  return (
    <div className="ml-4 pl-4 border-l-2 border-gray-200">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span>by {comment.user.name}</span>
        <span>-</span>
        <span>{formatTimeAgo(comment.createdAt)}</span>
      </div>
      {!showEditForm ? (
        <div className="mt-2">
          <div>{parse(comment.content)}</div>
        </div>
      ) : (
        <form onSubmit={handleEditSubmit} className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={3}
          />
          <div className="flex justify-end space-x-4 mt-2">
            <button
              type="button"
              onClick={() => setShowEditForm(false)}
              className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Update
            </button>
          </div>
        </form>
      )}

      {!isDeleted && !showEditForm && (
        <div className="flex items-center space-x-4 mt-2">
          {isAuthenticated && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-indigo-600 hover:underline"
            >
              Reply
            </button>
          )}
          {isAuthenticated && userId === comment.user._id && (
            <button
              onClick={() => setShowEditForm(true)}
              className="text-indigo-600 hover:underline"
            >
              Edit
            </button>
          )}
          {((isAuthenticated && userId === comment.user._id) ||
            role === "admin") && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Submit Reply
          </button>
        </form>
      )}
      <div className="mt-4">
        {comment.children?.map((child) => (
          <Comment
            key={child._id}
            comment={child}
            postId={postId}
            mutateComments={mutateComments}
          />
        ))}
      </div>
    </div>
  );
};

export default Comment;
