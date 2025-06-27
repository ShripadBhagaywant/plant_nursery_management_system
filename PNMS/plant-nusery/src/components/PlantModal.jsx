import React, { useEffect, useState } from "react";
import { X, Star, CheckCircle } from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { getAverageRating } from "../services/reviewService";
import ReviewForm from "../components/ReviewFrom";
import ReviewList from "../components/ReviewList";

const PlantModal = ({ plant, onClose }) => {
  const { addToCart } = useCart();
  const userId = localStorage.getItem("userId");
  const [avgRating, setAvgRating] = useState(null);

  if (!plant) return null;

  const handleAddToCart = () => {
    if (!userId) {
      toast.error("Login required");
      return;
    }
    addToCart(userId, plant);
  };

  const fetchRating = () => {
    getAverageRating(plant.id)
      .then((res) => setAvgRating(res.data.toFixed(1)))
      .catch(() => setAvgRating(null));
  };

  useEffect(() => {
    fetchRating();
  }, [plant]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl p-5 relative shadow-xl transition-all duration-300 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Image */}
          <div className="w-full md:w-1/2 rounded-xl overflow-hidden bg-gray-100">
            <img
              src={plant.imagePath || "/default-plant.jpg"}
              alt={plant.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-green-600 mb-1 font-poppins">{plant.name}</h2>
            {plant.categoryName && (
              <p className="text-sm text-gray-600 font-medium mb-2 font-poppins">
                {plant.categoryName}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-2">
              {plant.verified && (
                <span className="flex items-center text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-poppins">
                  <CheckCircle size={14} weight="fill" className="mr-1" />
                  Verified
                </span>
              )}
              {plant.bestSeller && (
                <span className="flex items-center text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full font-poppins">
                  <Star size={14} weight="fill" className="mr-1" />
                  Bestseller
                </span>
              )}
            </div>

            <p className="text-sm text-gray-700 mb-3 font-poppins">
              {plant.description || "No description available."}
            </p>

            <div className="text-lg font-semibold text-green-600 mb-1 font-poppins">
              ₹{plant.price}
            </div>

            {avgRating && (
              <p className="text-sm text-yellow-600 mb-4">
                ⭐ Average Rating: {avgRating}
              </p>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all font-poppins"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-6 border-t pt-4">
          <ReviewForm plantId={plant.id} onReviewSubmitted={fetchRating} />
          <ReviewList plantId={plant.id} />
        </div>
      </div>
    </div>
  );
};

export default PlantModal;
