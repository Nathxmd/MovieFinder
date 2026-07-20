import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import { useAuth } from "../context/AuthContext";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../lib/api";
import { fetchMovieById, fetchMoviesBySearch } from "../lib/movieApi";
import "../styles/MovieDetail.css";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const fetchMovieDetail = async () => {
    const data = await fetchMovieById(id);
    setMovie(data);

    if (session?.access_token) {
      const watchlist = await getWatchlist(session.access_token);
      setIsInWatchlist(watchlist.some((item) => item.movieId === data.imdbID));
    } else {
      setIsInWatchlist(false);
    }

    if (data.Genre) {
      const firstGenre = data.Genre.split(",")[0].trim();
      const recData = await fetchMoviesBySearch(firstGenre);
      if (recData.Search) {
        setRecommendations(
          recData.Search.filter((m) => m.imdbID !== data.imdbID),
        );
      }
    }
    setRecommendations((prev) => prev.slice(0, 5));
  };

  const toggleWatchlist = async () => {
    if (!session?.access_token) {
      navigate("/auth");
      return;
    }

    if (!movie) {
      return;
    }

    if (isInWatchlist) {
      await removeFromWatchlist(movie.imdbID, session.access_token);
    } else {
      await addToWatchlist(
        movie.imdbID,
        {
          title: movie.Title,
          poster: movie.Poster,
          year: movie.Year,
          genre: movie.Genre,
          plot: movie.Plot,
          director: movie.Director,
          actors: movie.Actors,
        },
        session.access_token,
      );
    }

    setIsInWatchlist((currentValue) => !currentValue);
  };

  useEffect(() => {
    fetchMovieDetail();
  }, [id, session?.access_token]);

  if (!movie) return <h2>Loading...</h2>;

  return (
    <div
      className="movie-detail"
      style={{
        backgroundImage: `url(${movie.Poster})`,
      }}
    >
      <div className="overlay">
        <div className="detail-content">
          <div className="poster">
            <img src={movie.Poster} alt={movie.Title} />
          </div>
          <div className="info">
            <h1>{movie.Title}</h1>
            <p>
              <strong>Released:</strong> {movie.Released}
            </p>
            <p>
              <strong>Genre:</strong> {movie.Genre}
            </p>
            <p>
              <strong>Director:</strong> {movie.Director}
            </p>
            <p>
              <strong>Actors:</strong> {movie.Actors}
            </p>
            <p>
              <strong>Plot:</strong> {movie.Plot}
            </p>
            <button
              onClick={toggleWatchlist}
              className="watchlist-btn"
              disabled={authLoading}
            >
              {session
                ? isInWatchlist
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"
                : "Sign in to save"}
            </button>
          </div>
        </div>

        {/* Rekomendasi Film */}
        {recommendations.length > 0 && (
          <div className="recommendations">
            <h2>Recommended Movies</h2>
            <div className="rec-list">
              {recommendations.map((rec) => (
                <a
                  key={rec.imdbID}
                  href={`/movie/${rec.imdbID}`}
                  className="rec-card"
                >
                  <img src={rec.Poster} alt={rec.Title} />
                  <p>{rec.Title}</p>
                </a>
              ))}
            </div>
          </div>
        )}
        {/* Section Komentar */}
        <CommentSection movie={movie} />
      </div>
    </div>
  );
}
