import { Link } from "react-router-dom";
import "../styles/Navbar.css"; // kita pisahkan stylenya juga

function Navbar() {
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
      </div>
    </nav>
  );
}

export default Navbar;
