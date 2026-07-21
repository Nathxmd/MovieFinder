const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_ACCESS_TOKEN) {
  throw new Error("Missing TMDB API key environment variable");
}

async function tmdbFetch(path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, value);
    }
  });
  const response = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
  });
  return response.json();
}

export async function searchMovies(query, page = 1) {
  return tmdbFetch("/search/movie", { query, page });
}

export async function fetchNowPlayingMovies() {
  return tmdbFetch("/movie/now_playing");
}

export async function fetchTopRatedMovies() {
  return tmdbFetch("/movie/top_rated");
}

export async function fetchTrendingMovies() {
  return tmdbFetch("/trending/movie/week");
}

export async function fetchMovieById(tmdbId) {
  return tmdbFetch(`/movie/${tmdbId}`, {
    append_to_response: "credits,videos",
  });
}

export async function fetchMovieRecommendations(tmdbId) {
  return tmdbFetch(`/movie/${tmdbId}/recommendations`);
}

export async function fetchMovieGenres() {
  return tmdbFetch("/genre/movie/list");
}

export async function discoverMovies({ genre, year, sortBy, page = 1 }) {
  return tmdbFetch("/discover/movie", {
    with_genres: genre,
    primary_release_year: year,
    sort_by: sortBy,
    page,
  });
}

export function getTmdbImageUrl(path, size = "w500") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
