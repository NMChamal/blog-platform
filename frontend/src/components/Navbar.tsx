import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/auth.store';

const Navbar = () => {
  const { isAuthenticated, clearAuth, role } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">Blog</Link>
        <div className="hidden md:block">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/my-account" className="text-white">My Account</Link>
              {(role === 'admin' || role === 'user') && (
                <Link to="/posts/create" className="text-white">Create Post</Link>
              )}
              <button onClick={clearAuth} className="text-white">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4">Login</Link>
              <Link to="/register" className="text-white">Register</Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4">
          {isAuthenticated ? (
            <div className="flex flex-col space-y-2">
              <Link to="/my-account" className="text-white">My Account</Link>
              {(role === 'admin' || role === 'user') && (
                <Link to="/posts/create" className="text-white">Create Post</Link>
              )}
              <button onClick={clearAuth} className="text-white text-left">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link to="/login" className="text-white">Login</Link>
              <Link to="/register" className="text-white">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
