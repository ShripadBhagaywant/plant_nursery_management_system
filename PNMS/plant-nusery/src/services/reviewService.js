// src/services/reviewService.js
import axiosInstance from "./axiosInstance";

export const getReviewsByPlantId = (plantId) =>
  axiosInstance.get(`/reviews/plant/${plantId}`);

export const submitReview = (plantId, userId, rating, comment) =>
  axiosInstance.post("/reviews", { plantId, userId, rating, comment });

export const getAverageRating = (plantId) =>
  axiosInstance.get(`/reviews/average-rating/${plantId}`);


export const updateReview = (reviewId, plantId, rating, comment) =>
  axiosInstance.put(`/reviews/${reviewId}`, {
    plantId,     // ✅ Required
    rating,      // ✅ Required
    comment     // ✅ Required
  });


export const deleteReview = (plantId) =>
  axiosInstance.delete(`/reviews/${plantId}`);
