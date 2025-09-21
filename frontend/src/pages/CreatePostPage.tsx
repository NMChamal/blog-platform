import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import Editor from "../components/Editor";
import { useApi } from "../hooks/useApi";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { post } = useApi("/api/posts");

  const handleSubmit = async (status: "draft" | "published") => {
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      const sanitizedContent = DOMPurify.sanitize(content);
      await post({ title, content: sanitizedContent, status });
      navigate("/");
    } catch (err: any) {
      setError(err.info?.message || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create Post</h1>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <Editor value={content} onChange={setContent} height="36rem" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            className="px-4 py-2 my-10 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("published")}
            className="px-4 py-2 my-10 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
