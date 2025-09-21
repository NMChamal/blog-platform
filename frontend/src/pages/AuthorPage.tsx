import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import PostCard from "../components/PostCard";
import PostListItem from "../components/PostListItem";
import useViewStore from "../store/view.store";
import Error from "../components/Error";

const AuthorPage = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const { data, error, isLoading } = useApi(`/api/posts/author/${authorId}`);
  const { view, toggleView } = useViewStore();

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    if (error.status === 404) {
      return <Error message="Author not found" />;
    }
    return <Error message="Error loading posts" />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Posts by {data?.posts[0]?.author.name}</h1>
        <button onClick={toggleView} className="px-4 py-2 font-bold text-white bg-gray-600 rounded-md hover:bg-gray-700">
          {view === 'grid' ? 'List View' : 'Grid View'}
        </button>
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

export default AuthorPage;
