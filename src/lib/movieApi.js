const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const OMDB_BASE_URL =
  import.meta.env.VITE_OMDB_API_URL ?? "https://www.omdbapi.com/";

if (!OMDB_API_KEY) {
  throw new Error("Missing OMDb API key environment variable");
}

function buildOmdbUrl(params) {
  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("apikey", OMDB_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

export async function fetchMoviesBySearch(query) {
  const response = await fetch(buildOmdbUrl({ s: query }));
  return response.json();
}

export async function fetchMovieById(imdbId) {
  const response = await fetch(buildOmdbUrl({ i: imdbId, plot: "full" }));
  return response.json();
}
