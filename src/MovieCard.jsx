const MovieCard = ({ movie }) => {
  return (
    <div className="movie">
      <div>
        <p>{movie.Title}</p>
      </div>
      <div>
        <img src={movie.Poster} alt={movie.Title} />
      </div>
      <div>
        <span>{movie.Type}</span>
        <h3>{movie.Title}</h3>
        <h3>{movie.Year}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
