import React from 'react';
import {
  ShoppingCartSimple,
  Eye,
  CheckCircle,
  Star,
} from '@phosphor-icons/react';
import { useCart } from "../context/CartContext";
import { toast } from 'sonner';


const PlantCard = ({ plant, onView }) => {
  const { addToCart } = useCart();
  const userId = localStorage.getItem("userId");
  localStorage.getItem("userId");


  const handleAddToCart = () => {
    if (!userId) {
      return toast.error("Login required to add to cart");
    }
    addToCart(userId, plant);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col group">
      {/* Image */}
      <div className="relative h-50 bg-gray-100 overflow-hidden rounded-t-2xl">
        <img
          src={plant.imagePath || '/default-plant.jpg'}
          alt={plant.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col p-4 flex-1 justify-between ">
        <div>
          <h3 className="text-lg font-semibold text-green-500 font-poppins mb-1">{plant.name}</h3>
          {plant.categoryName && (
            <p className="text-sm text-gray-500 font-semibold font-poppins mb-2">{plant.categoryName}</p>
          )}
        
          <div className="flex gap-3 mb-3">
            {plant.verified && (
              <div className="flex items-center text-blue-600 text-xs font-poppins rounded-full bg-blue-100 px-2 py-1">
                <CheckCircle size={16} weight="fill" className="mr-1" />
                Verified
              </div>
            )}
            {plant.bestSeller && (
              <div className="flex items-center text-yellow-500 text-xs font-poppins rounded-full bg-yellow-100 px-2 py-1">
                <Star size={16} weight="fill" className="mr-1" />
                Bestseller
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <span className="text-green-500 font-semibold text-md font-poppins">₹{plant.price}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView?.();
              }}
              className="bg-green-100 p-2 rounded-full hover:bg-green-200"
              title="View Details"
            >
              <Eye size={20} className="text-green-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="bg-green-500 p-2 rounded-full hover:bg-green-600"
              title="Add to Cart"
            >
              <ShoppingCartSimple size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
