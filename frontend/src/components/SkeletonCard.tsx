const SkeletonCard = () => {
  return (
    <div className="p-4 border rounded-lg shadow-sm h-48 flex flex-col animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex items-center space-x-4">
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
        </div>
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
