import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import "../styles/Home.css";
import {
  searchMovies,
  fetchNowPlayingMovies,
  fetchTopRatedMovies,
  getTmdbImageUrl,
} from "../lib/movieApi";

function TmdbMovieCard({ movie }) {
  const posterUrl = getTmdbImageUrl(movie.poster_path) || "/no-poster.png";

  return (
    <Link to={`/movie/${movie.id}`} className="movie">
      <div>
        <p>{movie.overview?.substring(0, 150)}...</p>
      </div>
      <div>
        <img src={posterUrl} alt={movie.title} />
      </div>
      <div>
        <span>{movie.release_date?.substring(0, 4) || "N/A"}</span>
        <h3>{movie.title}</h3>
      </div>
    </Link>
  );
}

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      setLoading(true);
      try {
        const [nowPlayingData, topRatedData] = await Promise.all([
          fetchNowPlayingMovies(),
          fetchTopRatedMovies(),
        ]);
        setNowPlaying(nowPlayingData.results?.slice(0, 6) || []);
        setTopRated(topRatedData.results?.slice(0, 6) || []);
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedMovies();
  }, []);

  const searchMoviesHandler = async (title) => {
    if (!title.trim()) {
      setMovies([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await searchMovies(title);
      setMovies(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchMoviesHandler(searchTerm);
  };

  return (
    <div className="home">
      <div className="search">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>

      {loading ? (
        <div className="empty">
          <h2>Loading...</h2>
        </div>
      ) : hasSearched && movies.length > 0 ? (
        <section className="movie-section">
          <h2 className="section-title">Search Results</h2>
          <div className="container">
            {movies.map((movie) => (
              <TmdbMovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      ) : hasSearched && movies.length === 0 ? (
        <div className="empty">
          <h2>No movies found</h2>
        </div>
      ) : (
        <>
          {nowPlaying.length > 0 && (
            <section className="movie-section">
              <h2 className="section-title">Now Playing</h2>
              <div className="container">
                {nowPlaying.map((movie) => (
                  <TmdbMovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

          {topRated.length > 0 && (
            <section className="movie-section">
              <h2 className="section-title">Top Rated</h2>
              <div className="container">
                {topRated.map((movie) => (
                  <TmdbMovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
