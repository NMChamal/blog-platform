import { useState } from "react";
import { useApi } from "../hooks/useApi";
import PostCard from "../components/PostCard";
import PostListItem from "../components/PostListItem";
import useViewStore from "../store/view.store";
import useAuthStore from "../store/auth.store";
import { Link } from "react-router-dom";

const MyAccountPage = () => {
  const { userId } = useAuthStore();
  const [status, setStatus] = useState<'all' | 'draft' | 'published'>('all');
  const { data: postsData, error: postsError, isLoading: postsIsLoading } = useApi(`/api/posts/my-posts?status=${status}`);
  const { data: userData, error: userError, isLoading: userIsLoading } = useApi(`/api/users/${userId}`);
  const { view, toggleView } = useViewStore();

  if (postsIsLoading || userIsLoading) return <div>Loading...</div>;
  if (postsError || userError) return <div>Error loading data</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">{userData?.data.name}</h1>
          <p className="text-gray-600">{userData?.data.description}</p>
        </div>
        <Link to="/my-account/edit" className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Edit Profile
        </Link>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Posts</h2>
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
          {postsData?.posts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {postsData?.posts.map((post: any) => (
            <PostListItem key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAccountPage;
