import axiosInstance from "../axiosInstance";

// Fetch all reviews with filters and pagination
export const getAllReviewsForAdmin = (params) => {
  return axiosInstance.get("/reviews/admin/all", { params });
};

// Delete review by ID (admin only)
export const deleteReviewById = (reviewId) => {
  return axiosInstance.delete(`/reviews/admin/${reviewId}`);
};
