import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center shadow">
      <div className="flex gap-4 items-center">
        <Link to="/" className="font-bold text-xl text-white hover:text-pink-400">🎵 Unreleased</Link>
        <Link to="/" className="hover:text-pink-300">Home</Link>
        {currentUser && (
          <>
            <Link to="/upload" className="hover:text-pink-300">Upload</Link>
            <Link to="/favorites" className="hover:text-pink-300">Favorites</Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {currentUser ? (
          <button onClick={handleLogout} className="text-sm bg-pink-600 px-3 py-1 rounded hover:bg-pink-700">
            🚪 Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-pink-300">Login</Link>
            <Link to="/signup" className="hover:text-pink-300">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
