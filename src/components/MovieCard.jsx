import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <div className="movie">
      <Link to={`/movie/${movie.imdbID}`}>
        <div>
          <p>{movie.Year}</p>
        </div>
        <div>
          <img
            src={
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/400"
            }
            alt={movie.Title}
          />
        </div>
        <div>
          <span>{movie.Type}</span>
          <h3>{movie.Title}</h3>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;
