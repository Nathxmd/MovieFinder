import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Watchlist.css";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(list);
  }, []);

  const removeFromWatchlist = (id) => {
    const updatedList = watchlist.filter((movie) => movie.imdbID !== id);
    setWatchlist(updatedList);
    localStorage.setItem("watchlist", JSON.stringify(updatedList));
  };

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="watchlist-grid">
          {watchlist.map((movie) => (
            <div key={movie.imdbID} className="watchlist-card">
              <Link to={`/movie/${movie.imdbID}`}>
                <img src={movie.Poster} alt={movie.Title} />
              </Link>
              <p>{movie.Title}</p>
              <button onClick={() => removeFromWatchlist(movie.imdbID)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies in your watchlist.</p>
      )}
    </div>
  );
}
