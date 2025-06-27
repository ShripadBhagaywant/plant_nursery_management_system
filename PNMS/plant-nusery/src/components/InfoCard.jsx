import React from "react";

const InfoCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md px-5 py-6 w-full max-w-xs hover:shadow-lg transition duration-300">
      <div className="flex items-center gap-3 mb-4 text-green-700">
        <div className="text-green-500">
          {icon}
        </div>
        <h3 className="text-lg font-semibold font-poppins text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm font-poppins">{description}</p>
    </div>
  );
};

export default InfoCard;
