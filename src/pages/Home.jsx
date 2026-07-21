import { useEffect, useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import {
  searchMovies,
  fetchNowPlayingMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchMovieGenres,
  discoverMovies,
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

function TrendingHero({ movie }) {
  const backdropUrl = getTmdbImageUrl(movie.backdrop_path, "original");

  return (
    <div className="trending-hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <span className="hero-badge">Trending</span>
          <h1>{movie.title}</h1>
          <p className="hero-overview">{movie.overview?.substring(0, 200)}...</p>
          <div className="hero-meta">
            <span>{movie.release_date?.substring(0, 4)}</span>
            <span>★ {movie.vote_average?.toFixed(1)}</span>
          </div>
          <Link to={`/movie/${movie.id}`} className="hero-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function FilterBar({ genres, filters, setFilters, onApply }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <select
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="popularity.desc">Popularity</option>
          <option value="vote_average.desc">Rating</option>
          <option value="release_date.desc">Release Date</option>
          <option value="original_title.asc">Title A-Z</option>
        </select>
        <button onClick={onApply} className="filter-apply-btn">
          <FaFilter /> Apply
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [trending, setTrending] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    sortBy: "popularity.desc",
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [nowPlayingData, topRatedData, trendingData, genresData] = await Promise.all([
          fetchNowPlayingMovies(),
          fetchTopRatedMovies(),
          fetchTrendingMovies(),
          fetchMovieGenres(),
        ]);
        setNowPlaying(nowPlayingData.results?.slice(0, 6) || []);
        setTopRated(topRatedData.results?.slice(0, 6) || []);
        setTrending(trendingData.results?.slice(0, 5) || []);
        setGenres(genresData.genres || []);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
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

  const handleApplyFilters = async () => {
    if (!filters.genre && !filters.year && filters.sortBy === "popularity.desc") {
      return;
    }
    setLoading(true);
    setHasSearched(true);
    setSearchTerm("");
    try {
      const data = await discoverMovies({
        genre: filters.genre,
        year: filters.year,
        sortBy: filters.sortBy,
      });
      setMovies(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchMoviesHandler(searchTerm);
  };

  const currentTrending = trending[0];

  return (
    <div className="home">
      {currentTrending && !hasSearched && (
        <TrendingHero movie={currentTrending} />
      )}

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
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter />
        </button>
      </div>

      {showFilters && (
        <FilterBar
          genres={genres}
          filters={filters}
          setFilters={setFilters}
          onApply={handleApplyFilters}
        />
      )}

      {loading ? (
        <div className="empty">
          <h2>Loading...</h2>
        </div>
      ) : hasSearched && movies.length > 0 ? (
        <section className="movie-section">
          <h2 className="section-title">Results</h2>
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
          {trending.length > 1 && (
            <section className="movie-section">
              <h2 className="section-title">Trending This Week</h2>
              <div className="container">
                {trending.slice(1).map((movie) => (
                  <TmdbMovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}

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
