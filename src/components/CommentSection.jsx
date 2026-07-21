import { useEffect, useMemo, useState } from "react";
import CommentBox from "./CommentBox";
import { useAuth } from "../context/AuthContext";
import { getReviews, upsertReview } from "../lib/api";
import "../styles/CommentSection.css";

function CommentSection({ movie }) {
  const { session } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const movieId = movie?.imdbID;

  useEffect(() => {
    if (!movieId) {
      setComments([]);
      return;
    }

    const loadReviews = async () => {
      setLoading(true);
      try {
        const data = await getReviews(movieId);
        setComments(data.reviews || []);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [movieId]);

  const averageRating = useMemo(() => {
    if (comments.length === 0) {
      return 0;
    }

    const totalRating = comments.reduce((sum, item) => sum + item.rating, 0);
    return (totalRating / comments.length).toFixed(1);
  }, [comments]);

  const handleAddComment = async (newComment) => {
    if (!session?.access_token || !movie) {
      return;
    }

    await upsertReview(
      movie.imdbID,
      {
        title: movie.Title,
        poster: movie.Poster,
        year: movie.Year,
        genre: movie.Genre,
        plot: movie.Plot,
        director: movie.Director,
        actors: movie.Actors,
        rating: newComment.rating,
        comment: newComment.comment,
        reviewerName: newComment.name,
      },
      session.access_token,
    );

    const data = await getReviews(movie.imdbID);
    setComments(data.reviews || []);
  };

  return (
    <div className="comment-section">
      <div className="comment-section-header">
        <div>
          <h3>Comments & Reviews</h3>
          {movie?.Title ? (
            <p>Share your thoughts about {movie.Title}.</p>
          ) : null}
        </div>
        <div className="rating-summary">
          <strong>{averageRating}</strong>
          <span>/ 5 average rating</span>
        </div>
      </div>
      <div className="comments-list">
        {!session ? (
          <p className="empty-review-state">
            Sign in to leave a review and rate this movie.
          </p>
        ) : (
          <CommentBox onSubmit={handleAddComment} />
        )}
        <div className="review-list">
          {loading ? (
            <p className="empty-review-state">Loading reviews...</p>
          ) : comments.length === 0 ? (
            <p className="empty-review-state">
              Belum ada review untuk film ini. Jadilah yang pertama memberi
              penilaian.
            </p>
          ) : (
            comments.map((comment) => (
              <article key={comment.id} className="review-card">
                <div className="review-card-header">
                  <strong>{comment.reviewerName || "Anonymous"}</strong>
                  <span>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div
                  className="review-stars"
                  aria-label={`${comment.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, index) => index + 1).map(
                    (star) => (
                      <span
                        key={star}
                        className={star <= comment.rating ? "filled" : ""}
                      >
                        ★
                      </span>
                    ),
                  )}
                </div>
                <p>{comment.comment}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
