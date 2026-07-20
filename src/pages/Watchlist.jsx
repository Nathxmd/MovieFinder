import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getWatchlist, removeFromWatchlist } from "../lib/api";
import "../styles/Watchlist.css";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { session } = useAuth();

  useEffect(() => {
    const loadWatchlist = async () => {
      if (!session?.access_token) {
        setWatchlist([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const list = await getWatchlist(session.access_token);
        setWatchlist(list);
      } catch (watchlistError) {
        setError(watchlistError.message);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, [session?.access_token]);

  const handleRemoveFromWatchlist = async (id) => {
    if (!session?.access_token) {
      return;
    }

    await removeFromWatchlist(id, session.access_token);
    setWatchlist((currentWatchlist) =>
      currentWatchlist.filter((item) => item.movieId !== id),
    );
  };

  if (!session) {
    return (
      <div className="watchlist-page">
        <h1>My Watchlist</h1>
        <p>
          Please <Link to="/auth">sign in</Link> to see and manage your
          watchlist.
        </p>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>
      {loading ? (
        <p>Loading watchlist...</p>
      ) : error ? (
        <p>{error}</p>
      ) : watchlist.length > 0 ? (
        <div className="watchlist-grid">
          {watchlist.map((item) => (
            <div key={item.id} className="watchlist-card">
              <Link to={`/movie/${item.movieId}`}>
                <img src={item.movie.poster} alt={item.movie.title} />
              </Link>
              <p>{item.movie.title}</p>
              <button onClick={() => handleRemoveFromWatchlist(item.movieId)}>
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
