const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

async function request(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Request failed");
  }

  return response.json();
}

export function getWatchlist(token) {
  return request("/watchlist", { token });
}

export function addToWatchlist(imdbId, movie, token) {
  return request(`/watchlist/${imdbId}`, { method: "POST", body: movie, token });
}

export function removeFromWatchlist(imdbId, token) {
  return request(`/watchlist/${imdbId}`, { method: "DELETE", token });
}

export function getReviews(imdbId) {
  return request(`/reviews/${imdbId}`);
}

export function upsertReview(imdbId, payload, token) {
  return request(`/reviews/${imdbId}`, { method: "POST", body: payload, token });
}

export function deleteReview(reviewId, token) {
  return request(`/reviews/${reviewId}`, { method: "DELETE", token });
}
