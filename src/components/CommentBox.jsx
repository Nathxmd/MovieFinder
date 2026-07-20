import { useState } from "react";

function CommentBox({ onSubmit, disabled = false }) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (disabled || !comment.trim() || rating === 0) {
      return;
    }

    onSubmit({
      name: name.trim() || "Anonymous",
      comment: comment.trim(),
      rating,
    });

    setName("");
    setComment("");
    setRating(0);
    setHoverRating(0);
  };

  return (
    <form className="comment-box" onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>
      <input
        type="text"
        className="comment-input"
        placeholder="Your name (optional)"
        value={name}
        disabled={disabled}
        onChange={(event) => setName(event.target.value)}
      />
      <div className="rating-group" aria-label="Movie rating">
        {Array.from({ length: 5 }, (_, index) => index + 1).map((star) => {
          const isActive = (hoverRating || rating) >= star;

          return (
            <button
              key={star}
              type="button"
              className={`star-button ${isActive ? "active" : ""}`}
              disabled={disabled}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              ★
            </button>
          );
        })}
      </div>
      <textarea
        className="comment-textarea"
        placeholder="Write your comment here..."
        value={comment}
        disabled={disabled}
        onChange={(event) => setComment(event.target.value)}
        rows={4}
      />
      <button type="submit" className="submit-review-btn" disabled={disabled}>
        Submit Review
      </button>
    </form>
  );
}

export default CommentBox;
