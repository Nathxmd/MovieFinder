import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../styles/Navbar.css";

function Navbar() {
  const { user, loading, signOut } = useAuth();
  const toast = useToast();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span role="img" aria-label="movie">
          🎬
        </span>{" "}
        Movie Finder
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/watchlist">Watchlist</Link>
        {loading ? null : user ? (
          <>
            <span className="navbar-user">{user.email}</span>
            <button type="button" className="navbar-action" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="navbar-action-link">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
