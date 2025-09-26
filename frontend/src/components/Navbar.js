import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between">
      <div className="font-bold text-xl">Foodie</div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/donate">Donate</Link>
        <Link to="/claim">Claim</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {/* Show Login/Signup only if not logged in */}
        {!isLoggedIn && (
          <>
            <Link to="/login" className="bg-white text-green-600 px-3 py-1 rounded">Login</Link>
            <Link to="/signup" className="bg-white text-green-600 px-3 py-1 rounded">Signup</Link>
          </>
        )}

        {/* Show Logout only if logged in */}
        {isLoggedIn && (
          <button
            onClick={logout}
            className="bg-white text-green-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
