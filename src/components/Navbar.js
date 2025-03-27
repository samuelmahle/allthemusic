import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-black text-white px-4 py-3 flex flex-wrap justify-between items-center">
      <div className="text-xl font-bold">🎵 Unreleased Music</div>
      <div className="flex space-x-4 mt-2 sm:mt-0">
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/favorites">Favorites</Link>
        {currentUser && (
          <button onClick={logout} className="text-red-400 hover:underline">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
