import React from "react";

const PlantSkeleton = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow animate-pulse space-y-3">
      <div className="bg-gray-300 h-36 w-full rounded-lg" />
      <div className="bg-gray-300 h-4 w-2/3 rounded" />
      <div className="bg-gray-300 h-3 w-1/2 rounded" />
      <div className="bg-gray-300 h-8 w-20 rounded-full mt-2" />
    </div>
  );
};

export default PlantSkeleton;
