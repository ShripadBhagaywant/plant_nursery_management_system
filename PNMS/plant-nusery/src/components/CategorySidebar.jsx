import React from "react";
import {
  Leaf,
  TreeStructure,
  Flower,
  TreePalm,
  Plant,
  FlowerTulip,
  Clover
} from "@phosphor-icons/react";

const categories = [
  { label: "All", icon: <TreeStructure size={18} /> },
  { label: "Indoor", icon: <Plant size={18} /> },
  { label: "Outdoor", icon: <TreePalm size={18} /> },
  { label: "Flowering", icon: <Flower size={18} /> },
  { label: "Herbal", icon: <Leaf size={18} /> },
  { label: "Decorative", icon: <Clover size={18} /> },
  { label: "Medical", icon: <FlowerTulip   size={18} /> },
];

const CategorySidebar = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <aside className="bg-white p-4 shadow-md rounded-xl w-full md:w-64">
      <h2 className="text-xl font-semibold mb-4 text-green-700">Categories</h2>
      <ul className="space-y-2">
        {categories.map(({ label, icon }) => (
          <li key={label}>
            <button
              onClick={() => setSelectedCategory(label)}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg transition ${
                selectedCategory === label
                  ? "bg-green-100 text-green-800 font-bold"
                  : "hover:bg-green-50 text-gray-700"
              }`}
            >
              {icon}
              {label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;
