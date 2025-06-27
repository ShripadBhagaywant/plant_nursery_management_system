import React, { useState } from "react";
import { submitReview } from "../services/reviewService";
import { toast } from "sonner";
import StarRating from "../components/StarRating"; 

const ReviewForm = ({ plantId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitReview(plantId, userId, rating, comment);
      toast.success("Review submitted!");
      setComment("");
      setRating(5); // Reset to default if needed
      onReviewSubmitted();
    } catch (err) {
      toast.error("Failed to submit review.");
    }
  };

  if (!userId) return null;

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4 className="font-semibold mb-2">Write a Review</h4>

      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm">Rating:</label>
        <StarRating rating={rating} onClick={(value) => setRating(value)} />
      </div>

      <textarea
        placeholder="Write your comment..."
        className="w-full border px-3 py-2 rounded mb-2"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      ></textarea>

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded text-sm"
      >
        Submit
      </button>
    </form>
  );
};

export default ReviewForm;
