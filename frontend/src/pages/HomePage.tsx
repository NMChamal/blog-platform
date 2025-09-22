import { useSearchParams } from "react-router-dom";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import PostCard from "../components/PostCard";
import PostListItem from "../components/PostListItem";
import useViewStore from "../store/view.store";
import SkeletonCard from "../components/SkeletonCard";
import { fetcher } from "../hooks/useApi";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { view, toggleView } = useViewStore();
  const { ref, inView } = useInView({ threshold: 1 });

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.posts.length) return null;
    return `/api/posts?search=${searchQuery}&page=${pageIndex + 1}`;
  };

  const { data, error, size, setSize, isLoading } = useSWRInfinite(
    getKey,
    fetcher
  );

  const posts = data ? [].concat(...data.map((page) => page.posts)) : [];
  const isLoadingMore = isLoading && data && typeof data[size - 1] === "undefined";
  const isEmpty = data?.[0]?.posts.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.posts.length < 10);

  useEffect(() => {
    if (inView && !isReachingEnd) {
      setSize(size + 1);
    }
  }, [inView, isReachingEnd, setSize]);

  if (error) return <div>Error loading posts</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Latest Posts</h1>
        <button
          onClick={toggleView}
          className="px-4 py-2 font-bold text-white bg-gray-600 rounded-md hover:bg-gray-700"
        >
          {view === "grid" ? "List View" : "Grid View"}
        </button>
      </div>
      {isEmpty && searchQuery && (
        <p>No posts found for the search term: {searchQuery}</p>
      )}
      {view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
          {isLoadingMore &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <PostListItem key={post._id} post={post} />
          ))}
          {isLoadingMore &&
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}
      <div ref={ref} />
    </div>
  );
};

export default HomePage;
