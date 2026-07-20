import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { user, loading, signOut } = useAuth();

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
            <button type="button" className="navbar-action" onClick={signOut}>
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
