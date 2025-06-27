import React, { useEffect, useState } from "react";
import {
  getReviewsByPlantId,
  deleteReview,
  updateReview,
} from "../services/reviewService";
import { toast } from "sonner";
import StarRating from "../components/StarRating"; 

const ReviewList = ({ plantId }) => {
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  const userId = localStorage.getItem("userId");

  const fetchReviews = () => {
    getReviewsByPlantId(plantId)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    fetchReviews();
  }, [plantId]);

  const handleDelete = async (plantId) => {
    try {
      await deleteReview(plantId);
      toast.success("Review deleted");
      fetchReviews();
    } catch {
      toast.error("Error deleting review");
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review.id);
    setEditContent(review.comment);
    setEditRating(review.rating);
  };

  const handleSave = async (reviewId) => {
    try {
      await updateReview(reviewId, plantId, editRating, editContent); // ✅ Send all fields
      toast.success("Review updated");
      setEditingReviewId(null);
      fetchReviews();
    } catch {
      toast.error("Error updating review");
    }
  };


  return (
    <div>
      <h4 className="font-semibold mb-2">Customer Reviews</h4>
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li key={review.id} className="border p-3 rounded-md bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">{review.userName}</span>
                <span className="text-yellow-600 text-xs">⭐ {review.rating}</span>
              </div>

              {editingReviewId === review.id ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm">Rating:</label>
                    <StarRating rating={editRating} onClick={(value) => setEditRating(value)} />
                  </div>
                  <textarea
                    className="w-full border px-3 py-2 rounded mb-2"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  ></textarea>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(review.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingReviewId(null)}
                      className="text-gray-500 px-3 py-1 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                  {review.userId === Number(userId) && (
                    <div className="mt-2 flex gap-3 text-sm text-blue-500">
                      <button onClick={() => handleEdit(review)}>Edit</button>
                      <button
                        onClick={() => handleDelete(plantId)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewList;
