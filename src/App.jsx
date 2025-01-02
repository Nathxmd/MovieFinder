import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./App.css";
import MovieCard from "./MovieCard";

// API URL FROM OMDB
const API_URL = "https://www.omdbapi.com/?apikey=963505bc";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getRandomMovies = async () => {
    const response = await fetch(`${API_URL}&s=movie`);
    const data = await response.json();

    if (data.Search) {
      const uniqueMovies = new Set();
      const randomMovies = [];
      const totalMovies = data.Search.length;

      while (uniqueMovies.size < Math.min(6, totalMovies)) {
        const randomIndex = Math.floor(Math.random() * totalMovies);
        const movie = data.Search[randomIndex];

        if (!uniqueMovies.has(movie.imdbID)) {
          uniqueMovies.add(movie.imdbID);
          randomMovies.push(movie);
        }
      }

      setMovies(randomMovies);
    }
  };

  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();

    setMovies(data.Search);
  };

  useEffect(() => {
    getRandomMovies();
  }, []);

  return (
    <>
      <div className="app">
        <h1>Movie Finder</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Search for a movie"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <FaSearch
            onClick={() => searchMovies(searchTerm)}
            className="btn-search"
          />
        </div>

        {movies?.length > 0 ? (
          <div className="container">
            {movies.map((movie, index) => (
              <MovieCard key={index} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>Search for your favourite movies & TV Series</h2>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
