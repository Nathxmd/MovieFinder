import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/MovieDetail.css"; // Assuming you have a CSS file for styling
import CommentSection from "../components/CommentSection"; // Import the CommentSection component

const API_URL = "https://www.omdbapi.com/?apikey=963505bc";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Ambil detail film
  const fetchMovieDetail = async () => {
    const res = await fetch(`${API_URL}&i=${id}&plot=full`);
    const data = await res.json();
    setMovie(data);

    // Cek apakah film ini ada di watchlist
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    setIsInWatchlist(watchlist.some((m) => m.imdbID === data.imdbID));

    // Ambil rekomendasi film berdasarkan genre pertama
    if (data.Genre) {
      const firstGenre = data.Genre.split(",")[0].trim();
      const recRes = await fetch(`${API_URL}&s=${firstGenre}`);
      const recData = await recRes.json();
      if (recData.Search) {
        // Filter agar tidak memunculkan film yang sama
        setRecommendations(
          recData.Search.filter((m) => m.imdbID !== data.imdbID),
        );
      }
    }
    // limit data rekomendasi menjadi 5
    setRecommendations((prev) => prev.slice(0, 5));
  };

  // Tambah/Hapus dari watchlist
  const toggleWatchlist = () => {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (isInWatchlist) {
      watchlist = watchlist.filter((m) => m.imdbID !== movie.imdbID);
    } else {
      watchlist.push(movie);
    }

    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    setIsInWatchlist(!isInWatchlist);
  };

  useEffect(() => {
    fetchMovieDetail();
  }, [id]);

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
            <button onClick={toggleWatchlist} className="watchlist-btn">
              {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
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
        <CommentSection movieId={movie.imdbID} movieTitle={movie.Title} />
      </div>
    </div>
  );
}
