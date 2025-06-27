import React, { useState } from "react";
import useFetchPlants from "../hooks/useFetchPlants";
import CategorySidebar from "../components/CategorySidebar";
import PlantModal from "../components/PlantModal";
import PlantSkeleton from "../components/PlantSkeleton";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import PlantCard from "../components/PlantCard";

import {
  Leaf,
  TreeStructure,
  Flower,
  HouseSimple,
  SunDim,
  PaintBrushBroad,
  CaretDown,
  FlowerTulip
} from "@phosphor-icons/react";

const categoryOptions = [
  { label: "All", icon: <Leaf size={18} /> },
  { label: "Indoor", icon: <HouseSimple size={18} /> },
  { label: "Outdoor", icon: <SunDim size={18} /> },
  { label: "Flowering", icon: <Flower size={18} /> },
  { label: "Herbal", icon: <TreeStructure size={18} /> },
  { label: "Decorative", icon: <PaintBrushBroad size={18} /> },
  { label: "Medical", icon: <FlowerTulip size={18} /> },
];

const PlantPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPlant, setModalPlant] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { plants, loading, totalPages } = useFetchPlants(
    selectedCategory,
    currentPage,
    keyword
  );

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleAddToCart = (plant) => {
    console.log("Added to cart:", plant.name);
    // integrate with your cart context/service
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Navbar />

      <div className="pt-24 pb-10 px-4 md:px-12 max-w-7xl mx-auto">
        {/* Layout wrapper */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar (Desktop) */}
          <div className="hidden md:block md:w-1/4">
            <CategorySidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Dropdown */}
            <div className="md:hidden mb-6 relative">
              <button
                onClick={toggleDropdown}
                className="w-full p-3 flex items-center justify-between bg-green-100 text-green-800 rounded-lg border border-green-300"
              >
                <div className="flex items-center gap-2">
                  {
                    categoryOptions.find((cat) => cat.label === selectedCategory)
                      ?.icon
                  }
                  <span>{selectedCategory}</span>
                </div>
                <CaretDown size={16} />
              </button>

              {dropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
                  {categoryOptions.map((cat) => (
                    <div
                      key={cat.label}
                      onClick={() => {
                        setSelectedCategory(cat.label);
                        setDropdownOpen(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer hover:bg-green-50 ${
                        selectedCategory === cat.label
                          ? "bg-green-100 text-green-800"
                          : ""
                      }`}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plant Cards or Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <PlantSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {plants.map((plant) => (
                    <PlantCard
                      key={plant.id}
                      plant={plant}
                      onView={() => setModalPlant(plant)}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Plant Modal */}
      {modalPlant && (
        <PlantModal
          plant={modalPlant}
          onClose={() => setModalPlant(null)}
        />
      )}
    </div>
  );
};

export default PlantPage;
