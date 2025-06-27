import React from "react";
import moment from "moment";
import { Warning , CheckCircle ,Eye } from "@phosphor-icons/react";

const InventoryCard = ({ item }) => {
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl border transition-all duration-300 ${
        item.quantity < 5 ? "border-red-500" : "border-green-500"
      }`}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-start ">
        <div className="flex gap-4 items-center justify-center cursor-pointer">
          <img
            src={item.plantImageUrl}
            alt={item.plantName}
            className="w-14 h-14 overflow-hidden border border-green-500 rounded-full hover:scale-105 transition-transform duration-300 shadow-sm hover:shadow-lg cursor-pointer object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold text-green-500 font-poppins">
              {item.plantName}
            </h3>
            <p className="text-sm text-gray-500 mt-1 font-poppins">
              Updated {moment(item.lastUpdated).fromNow()}
            </p>
          </div>
        </div>

        {item.quantity < 5 && (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap cursor-pointer font-poppins">
            <Warning size={16} />
            Low Stock
          </span>
        )}

        {item.quantity > 5 && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap cursor-pointer font-poppins">
            <CheckCircle size={16} />
            In Stock
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Footer */}
      <div className="p-4 flex justify-between items-center cursor-pointer font-poppins">
        <span
          className={`text-sm px-3 py-1 rounded-full ${
            item.quantity < 5
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-800"
          }`}
        >
          Quantity: {item.quantity}
        </span>

       <div className="group relative">
        <Eye
          size={24}
          className="text-green-500 cursor-pointer show"
          onClick={() => onViewDetails(item)}
        />
        <span className="absolute bottom-full mb-2 hidden group-hover:block text-xs bg-green-100 text-white-800 px-1 py-1 rounded-lg shadow-lg font-poppins">
          View 
        </span>
      </div>

      </div>
    </div>
  );
};

export default InventoryCard;
