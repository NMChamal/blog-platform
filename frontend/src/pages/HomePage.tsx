import { useApi } from "../hooks/useApi";

const HomePage = () => {
  const { data, error, isLoading } = useApi("/api/posts");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Latest Posts</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.posts.map((post: any) => (
          <div key={post._id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">by {post.author.name}</p>
            <p className="mt-2">{post.content.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
