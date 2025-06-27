import { Star } from "@phosphor-icons/react";
import { useState } from "react";

const StarRating = ({ rating, onClick }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          weight="fill" 
          onClick={() => onClick && onClick(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`cursor-pointer w-6 h-6 transition-colors ${
            star <= (hovered || rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
