import { useState } from "react";
import { useApi } from "../hooks/useApi";
import PostCard from "../components/PostCard";
import PostListItem from "../components/PostListItem";
import useViewStore from "../store/view.store";

const MyAccountPage = () => {
  const [status, setStatus] = useState<'all' | 'draft' | 'published'>('all');
  const { data, error, isLoading } = useApi(`/api/posts/my-posts?status=${status}`);
  const { view, toggleView } = useViewStore();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <div className="flex space-x-4">
          <button onClick={() => setStatus('all')} className={`px-4 py-2 font-bold rounded-md ${status === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
          <button onClick={() => setStatus('draft')} className={`px-4 py-2 font-bold rounded-md ${status === 'draft' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Drafts</button>
          <button onClick={() => setStatus('published')} className={`px-4 py-2 font-bold rounded-md ${status === 'published' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Published</button>
          <button onClick={toggleView} className="px-4 py-2 font-bold text-white bg-gray-600 rounded-md hover:bg-gray-700">
            {view === 'grid' ? 'List View' : 'Grid View'}
          </button>
        </div>
      </div>
      {view === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.posts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data?.posts.map((post: any) => (
            <PostListItem key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAccountPage;
