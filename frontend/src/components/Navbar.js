import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../socket";

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // 🔑 STEP 4 (CRITICAL): EVERY USER JOINS PERSONAL SOCKET ROOM
  useEffect(() => {
    if (userId) {
      socket.emit("join_user", userId);
      console.log("🟢 Joined personal socket room: user_" + userId);
    }
  }, [userId]);

  // 🔔 LISTEN FOR CLAIM NOTIFICATION (DONATOR)
  useEffect(() => {
    const handleClaimNotification = ({ donationId, message }) => {
      alert(message || "Your donation was claimed!");
      navigate(`/chat/${donationId}`);
    };

    socket.on("claim_notification", handleClaimNotification);

    return () => {
      socket.off("claim_notification", handleClaimNotification);
    };
  }, [navigate]);

  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">shareBites</div>

      <div className="space-x-4 flex items-center">
        {/* Common links */}
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {/* Donator */}
        {role === "donator" && (
  <>
        <Link to="/donate">Donate</Link>
        <Link to="/my-donations">My Donations</Link>
       </>
      )}


        {/* Claimer / NGO / Volunteer */}
        {(role === "individual_claimer" ||
          role === "ngo" ||
          role === "volunteer") && (
          <Link to="/claim">Find Food</Link>
        )}

        {/* Admin */}
        {role === "admin" && <Link to="/admin">Admin Panel</Link>}

        {/* Auth */}
        {!isLoggedIn ? (
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
        ) : (
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
