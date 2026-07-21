import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import { useAuth } from "../context/AuthContext";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../lib/api";
import {
  fetchMovieById,
  fetchMovieRecommendations,
  getTmdbImageUrl,
} from "../lib/movieApi";
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
      setIsInWatchlist(watchlist.some((item) => item.movieId === String(data.id)));
    } else {
      setIsInWatchlist(false);
    }

    const recData = await fetchMovieRecommendations(id);
    setRecommendations(recData.results?.slice(0, 5) || []);
  };

  const toggleWatchlist = async () => {
    if (!session?.access_token) {
      navigate("/auth");
      return;
    }

    if (!movie) {
      return;
    }

    const movieId = String(movie.id);

    if (isInWatchlist) {
      await removeFromWatchlist(movieId, session.access_token);
    } else {
      await addToWatchlist(
        movieId,
        {
          title: movie.title,
          poster: getTmdbImageUrl(movie.poster_path),
          year: movie.release_date?.substring(0, 4),
          genre: movie.genres?.map((g) => g.name).join(", "),
          plot: movie.overview,
          director: movie.credits?.crew?.find((c) => c.job === "Director")?.name,
          actors: movie.credits?.cast?.slice(0, 5).map((c) => c.name).join(", "),
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

  const posterUrl = getTmdbImageUrl(movie.poster_path, "original");
  const backdropUrl = getTmdbImageUrl(movie.backdrop_path, "original");

  return (
    <div
      className="movie-detail"
      style={{
        backgroundImage: `url(${backdropUrl || posterUrl})`,
      }}
    >
      <div className="overlay">
        <div className="detail-content">
          <div className="poster">
            <img src={posterUrl} alt={movie.title} />
          </div>
          <div className="info">
            <h1>{movie.title}</h1>
            <p>
              <strong>Released:</strong> {movie.release_date}
            </p>
            <p>
              <strong>Genre:</strong>{" "}
              {movie.genres?.map((g) => g.name).join(", ")}
            </p>
            <p>
              <strong>Director:</strong>{" "}
              {movie.credits?.crew?.find((c) => c.job === "Director")?.name ||
                "N/A"}
            </p>
            <p>
              <strong>Actors:</strong>{" "}
              {movie.credits?.cast
                ?.slice(0, 5)
                .map((c) => c.name)
                .join(", ") || "N/A"}
            </p>
            <p>
              <strong>Plot:</strong> {movie.overview}
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

        {recommendations.length > 0 && (
          <div className="recommendations">
            <h2>Recommended Movies</h2>
            <div className="rec-list">
              {recommendations.map((rec) => (
                <a
                  key={rec.id}
                  href={`/movie/${rec.id}`}
                  className="rec-card"
                >
                  <img
                    src={getTmdbImageUrl(rec.poster_path) || "/no-poster.png"}
                    alt={rec.title}
                  />
                  <p>{rec.title}</p>
                </a>
              ))}
            </div>
          </div>
        )}
        <CommentSection
          movie={{
            imdbID: String(movie.id),
            Title: movie.title,
            Poster: posterUrl,
            Year: movie.release_date?.substring(0, 4),
            Genre: movie.genres?.map((g) => g.name).join(", "),
            Plot: movie.overview,
            Director:
              movie.credits?.crew?.find((c) => c.job === "Director")?.name,
            Actors: movie.credits?.cast
              ?.slice(0, 5)
              .map((c) => c.name)
              .join(", "),
          }}
        />
      </div>
    </div>
  );
}
