import React, { useEffect, useState } from "react";
import { Spinner, PencilSimple, PlusCircle, CaretLeft, CaretRight, X , MagnifyingGlass , Plus, Minus, Leaf,Warning,Gift  } from "@phosphor-icons/react";
import { Dialog } from "@headlessui/react";
import { toast } from "sonner";
import {
  getPaginatedInventory,
  getLowStock,
  updateInventory,
  addInventoryQuantity,
  reduceInventoryQuantity,
} from "../services/admin/inventroyService";
import { getAllPlantsNames } from "../services/admin/plantService";

const AdminInventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [threshold, setThreshold] = useState(5);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const [allPlants, setAllPlants] = useState([]);
  const [newInventoryPlantId, setNewInventoryPlantId] = useState("");
  const [newInventoryQuantity, setNewInventoryQuantity] = useState("");
  const [loadingPlants, setLoadingPlants] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await getPaginatedInventory(page, search);
      setInventory(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to load inventory");
    }
    setLoading(false);
  };

  const fetchLowStock = async () => {
    setLoading(true);
    try {
      const res = await getLowStock(threshold);
      setInventory(res.data);
      setTotalPages(1);
      setPage(0);
    } catch (err) {
      toast.error("Failed to fetch low stock");
    }
    setLoading(false);
  };

  const fetchAllPlants = async () => {
    setLoadingPlants(true);
    try {
      const res = await getAllPlantsNames();
      setAllPlants(res.data);
    } catch (e) {
      toast.error("Failed to load plant list");
    }
    setLoadingPlants(false);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setNewQuantity(item.quantity);
    setIsModalOpen(true);
  };

  const updateQuantity = async () => {
    try {
      await updateInventory(editItem.plantId, newQuantity);
      toast.success("Quantity updated");
      setIsModalOpen(false);
      fetchInventory();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleAdd = async () => {
    try {
      await addInventoryQuantity(editItem.plantId, 1);
      setNewQuantity((prev) => prev + 1);
    } catch {
      toast.error("Failed to add quantity");
    }
  };

  const handleReduce = async () => {
    try {
      if (newQuantity > 0) {
        await reduceInventoryQuantity(editItem.plantId, 1);
        setNewQuantity((prev) => prev - 1);
      }
    } catch {
      toast.error("Failed to reduce quantity");
    }
  };

  const exportCSV = () => {
    const headers = ["Plant Name", "Quantity", "Last Updated"];
    const rows = inventory.map((item) => [
      item.plantName,
      item.quantity,
      new Date(item.lastUpdated).toLocaleString(),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inventory.csv";
    link.click();
  };

  const handleAddNewInventory = async () => {
    if (!newInventoryPlantId || !newInventoryQuantity) {
      toast.error("Plant and Quantity are required");
      return;
    }

    try {
      await updateInventory(newInventoryPlantId, parseInt(newInventoryQuantity));
      toast.success("Inventory added");
      setNewInventoryPlantId("");
      setNewInventoryQuantity("");
      fetchInventory();
    } catch {
      toast.error("Failed to add inventory");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page, search]);

  useEffect(() => {
    fetchAllPlants();
  }, []);

  return (
    <div className="bg-white font-[Poppins] rounded-xl shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Gift  size={28} className="text-green-400" />
          Inventory Management.
        </h2>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
       <div className="relative w-full md:w-1/2">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-800">
            <MagnifyingGlass size={20} />
          </span>
          <input
            type="text"
            placeholder="Search by plant name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="border pl-10 pr-4 py-2 rounded-xl w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={fetchLowStock}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded rounded-xl shadow-lg hover:shadow-xl cursor-pointer"
        >
          Show Low Stock (≤ {threshold})
        </button>
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl cursor-pointer"
        >
          Export CSV
        </button>
      </div>

      <div className="border p-4 rounded-md bg-gray-200 space-y-3 rounded-xl shadow-lg hover:shadow-xl cursor-pointer">
        <h3 className="text-md font-semibold text-gray-500 flex items-center gap-2 ">
          <PlusCircle size={18} /> Add Inventory for New Plant
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={newInventoryPlantId}
            onChange={(e) => setNewInventoryPlantId(e.target.value)}
            className="border p-2 rounded rounded-xl shadow-lg hover:shadow-xl cursor-pointer"
          >
            <option value="">{loadingPlants ? "Loading..." : "Select Plant"}</option>
            {allPlants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={newInventoryQuantity}
            onChange={(e) => setNewInventoryQuantity(e.target.value)}
            className="border p-2 rounded-xl shadow-lg hover:shadow-xl cursor-pointer"
          />
        </div>
        <button
          onClick={handleAddNewInventory}
          className="bg-orange-500 text-white px-4 py-2 rounded shadow-lg"
        >
          Add Inventory
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size={32} className="animate-spin text-green-500" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {inventory.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded-lg shadow-lg relative space-y-1 bg-white hover:shadow-xl cursor-pointer transition-all duration-200 ease-in-out ${
                item.quantity <= threshold ? "border-red-500" : "border-green-400"
              }`}
            >
              <img
                src={item.plantImageUrl}
                alt={item.plantName}
                className="h-45 object-cover rounded mb-2 w-full"
              />
             <h4 className="font-semibold flex justify-between items-center">
                {item.plantName}
                {item.quantity <= threshold && (
                  <span className="flex items-center gap-1 bg-white-100 text-red-600 text-xs px-2 py-1 rounded-full shadow hover:shadow-md transition cursor-default">
                    <Warning size={14} weight="fill" />
                    Low
                  </span>
                )}
              </h4>

              <p className="text-sm">Quantity: {item.quantity}</p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(item.lastUpdated).toLocaleString()}
              </p>
              <button
                onClick={() => openEditModal(item)}
                className="absolute top-3 right-4 text-blue-500 hover:text-red-600"
              >
                <PencilSimple size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 flex items-center gap-1 hover:bg-gray-100 shadow-lg"
          >
            <CaretLeft size={18} /> 
          </button>
          <span className="font-medium">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page + 1 === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 flex items-center gap-1 hover:bg-gray-100 shadow-lg"
          >
             <CaretRight size={18} />
          </button>
        </div>
      )}

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white font-[Poppins] p-6 rounded-2xl shadow-2xl w-full max-w-sm relative">
            
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={22} />
            </button>

            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full shadow">
                <Leaf size={24} weight="bold" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-center mb-2">
              Edit Quantity
            </h3>
            <p className="text-sm text-center text-gray-500 mb-4">
              {editItem?.plantName}
            </p>

            {/* Quantity Input */}
            <input
              type="number"
              min="0"
              className="border px-3 py-2 w-full rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value))}
            />

            {/* +/- Button Controls */}
            <div className="flex gap-4 justify-center mb-4">
              <button
                onClick={handleReduce}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full shadow"
              >
                <Minus size={20} />
              </button>
              <button
                onClick={handleAdd}
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full shadow"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={updateQuantity}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminInventoryManagement;
