import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth.store";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const { isAuthenticated, clearAuth, role } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
    }
  };

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          Blog
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="px-3 py-1 rounded-md bg-gray-700 text-white border border-gray-600"
            />
            <button
              type="submit"
              className="ml-2 px-3 py-1 rounded-md bg-green-700 text-white"
            >
              Search
            </button>
          </form>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/my-account" className="text-white">
                My Account
              </Link>
              {(role === "admin" || role === "user") && (
                <Link to="/posts/create" className="text-white">
                  Create Post
                </Link>
              )}
              <button onClick={clearAuth} className="text-white">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4">
                Login
              </Link>
              <Link to="/register" className="text-white">
                Register
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-white mr-4"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4">
          {isAuthenticated ? (
            <div className="flex flex-col space-y-2">
              <Link to="/my-account" className="text-white">
                My Account
              </Link>
              {(role === "admin" || role === "user") && (
                <Link to="/posts/create" className="text-white">
                  Create Post
                </Link>
              )}
              <button onClick={clearAuth} className="text-white text-left">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link to="/login" className="text-white">
                Login
              </Link>
              <Link to="/register" className="text-white">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
      {showSearch && (
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="px-3 py-1 rounded-md w-full bg-gray-700 text-white border border-gray-600"
            />
            <button
              type="submit"
              className="ml-2 px-3 py-1 rounded-md bg-green-700 text-white"
            >
              Search
            </button>
            <button
              onClick={() => setShowSearch(false)}
              className="ml-2 text-red-500 rounded-md border border-red-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
