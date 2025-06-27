import React, { useState, useEffect } from "react";
import { useUserInventory } from "../hooks/useUserInventory";
import Navbar from "../components/Navbar";
import PlantSkeleton from "../components/PlantSkeleton";
import Pagination from "../components/Pagination";
import InventoryCard from "../components/InventoryCard";
import { toast } from "sonner";
import { MagnifyingGlass, ArrowClockwise } from "@phosphor-icons/react";

const UserInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { inventory, loading, refetch, totalPages } = useUserInventory({
    searchTerm,
    page: currentPage,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleRefresh = async () => {
    setSearchTerm("");
    setCurrentPage(1);
    await refetch();
    toast.success("Inventory refreshed!", {
      position: "top-right",
      duration: 2000,
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 font-poppins pt-24">
        <div className="container mx-auto px-4 py-6">
          {/* Title */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-green-500 border border-white-200 rounded-2xl p-2 cursor-pointer shadow-md hover:shadow-lg transition">
               Inventory 🌿
            </h2>
          </div>

          {/* Search + Refresh */}
          <div className="flex flex-row justify-center items-center flex-wrap gap-3 mb-6">
            <div className="relative flex-grow max-w-full sm:max-w-md">
              <MagnifyingGlass
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search plants"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl shadow-sm hover:shadow-lg cursor-pointer focus:outline-none focus:ring-0 focus:border-gray-500 transition"
              />
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-2xl shadow-sm hover:shadow-lg hover:bg-green-200 transition whitespace-nowrap"
            >
              <ArrowClockwise size={20} />
              Refresh
            </button>
          </div>

          {/* Inventory Display */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <PlantSkeleton key={i} />
                ))}
            </div>
          ) : inventory.length === 0 ? (
            <p className="text-gray-500 text-center font-poppins">
              No inventory found
              {searchTerm && (
                <> for <span className="font-semibold">{searchTerm}</span></>
              )}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory.map((item) => (
                  <InventoryCard key={item.id} item={item} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserInventory;
