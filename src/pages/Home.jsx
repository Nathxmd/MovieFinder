import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import MovieCard from "../components/MovieCard";
import "../styles/Home.css";

const API_URL = "https://www.omdbapi.com/?apikey=963505bc";

export default function Home() {
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
    setMovies(data.Search || []);
  };

  useEffect(() => {
    getRandomMovies();
  }, []);

  return (
    <div className="home">
      <div className="search">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchMovies(searchTerm)}
        />
        <button onClick={() => searchMovies(searchTerm)}>
          <FaSearch />
        </button>
      </div>

      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No movies found 😢</h2>
        </div>
      )}
    </div>
  );
}
