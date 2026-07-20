import { useEffect, useMemo, useState } from "react";
import CommentBox from "./CommentBox";
import "../styles/CommentSection.css";

function CommentSection({ movieId, movieTitle }) {
  const storageKey = movieId ? `movie-comments-${movieId}` : null;
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!storageKey) {
      setComments([]);
      return;
    }

    const savedComments = JSON.parse(localStorage.getItem(storageKey)) || [];
    setComments(savedComments);
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) {
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(comments));
  }, [comments, storageKey]);

  const averageRating = useMemo(() => {
    if (comments.length === 0) {
      return 0;
    }

    const totalRating = comments.reduce((sum, item) => sum + item.rating, 0);
    return (totalRating / comments.length).toFixed(1);
  }, [comments]);

  const handleAddComment = (newComment) => {
    setComments((currentComments) => [
      {
        id: crypto.randomUUID(),
        ...newComment,
        createdAt: new Date().toISOString(),
      },
      ...currentComments,
    ]);
  };

  return (
    <div className="comment-section">
      <div className="comment-section-header">
        <div>
          <h3>Comments & Reviews</h3>
          {movieTitle ? <p>Share your thoughts about {movieTitle}.</p> : null}
        </div>
        <div className="rating-summary">
          <strong>{averageRating}</strong>
          <span>/ 5 average rating</span>
        </div>
      </div>
      <div className="comments-list">
        <CommentBox onSubmit={handleAddComment} />
        <div className="review-list">
          {comments.length === 0 ? (
            <p className="empty-review-state">
              Belum ada review untuk film ini. Jadilah yang pertama memberi
              penilaian.
            </p>
          ) : (
            comments.map((comment) => (
              <article key={comment.id} className="review-card">
                <div className="review-card-header">
                  <strong>{comment.name}</strong>
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
