import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    if (typeof error.data === 'string') {
      errorMessage = error.data;
    } else if (error.data && typeof error.data === 'object' && 'message' in error.data) {
      errorMessage = (error.data as any).message;
    } else {
      errorMessage = error.statusText;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  const renderError = () => {
    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return "Could not stringify the error object.";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="m-8 text-5xl font-bold text-gray-800">Oops!</h1>
      <p className="text-2xl font-medium text-gray-600 mb-4">
        Sorry, an unexpected error has occurred.
      </p>
      <p className="text-gray-500 mb-8">
        <i>{errorMessage}</i>
      </p>
      <pre className="text-left bg-gray-100 p-4 rounded-md">
        {renderError()}
      </pre>
      <Link
        to="/"
        className="mt-8 px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default ErrorPage;
