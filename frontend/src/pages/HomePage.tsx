import { useApi } from "../hooks/useApi";
import useAuthStore from "../store/auth.store";
import { Link, useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import PostListItem from "../components/PostListItem";
import useViewStore from "../store/view.store";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { data, error, isLoading } = useApi(`/api/posts?search=${searchQuery}`);
  const { isAuthenticated, role } = useAuthStore();
  const { view, toggleView } = useViewStore();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Latest Posts</h1>
        <button onClick={toggleView} className="px-4 py-2 font-bold text-white bg-gray-600 rounded-md hover:bg-gray-700">
          {view === 'grid' ? 'List View' : 'Grid View'}
        </button>
      </div>
      {data?.posts.length === 0 && searchQuery && (
        <p>No posts found for the search term: {searchQuery}</p>
      )}
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

export default HomePage;
