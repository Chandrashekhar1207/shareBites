import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);

  // Role stored after login
  const role = localStorage.getItem("role");

  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">shareBites</div>

      <div className="space-x-4 flex items-center">

        {/* Common links always visible */}
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {/* -------- ROLE-BASED NAVIGATION -------- */}

        {/* Donator can donate food */}
        {role === "donator" && (
          <Link to="/donate" className="px-2 py-1">
            Donate
          </Link>
        )}

        {/* Volunteer, NGO, Individual Claimer can find nearby food */}
        {(role === "volunteer" ||
          role === "ngo" ||
          role === "individual_claimer") && (
          <Link to="/nearby" className="px-2 py-1">
            Find Food
          </Link>
        )}

        {/* Admin Panel */}
        {role === "admin" && (
          <Link to="/admin" className="px-2 py-1">
            Admin Panel
          </Link>
        )}

        {/* -------- AUTH LINKS -------- */}

        {!isLoggedIn && (
          <>
            <Link
              to="/login"
              className="bg-white text-green-600 px-3 py-1 rounded"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white text-green-600 px-3 py-1 rounded"
            >
              Signup
            </Link>
          </>
        )}

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
