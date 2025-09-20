import { Link } from 'react-router-dom';
import useAuthStore from '../store/auth.store';

const Navbar = () => {
  const { isAuthenticated, clearAuth } = useAuthStore();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">Blog</Link>
        <div>
          {isAuthenticated ? (
            <button onClick={clearAuth} className="text-white">Logout</button>
          ) : (
            <>
              <Link to="/login" className="text-white mr-4">Login</Link>
              <Link to="/register" className="text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
