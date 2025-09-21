interface ErrorProps {
  message: string;
}

const Error = ({ message }: ErrorProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-red-500">Error</h1>
        <p className="text-center text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Error;
