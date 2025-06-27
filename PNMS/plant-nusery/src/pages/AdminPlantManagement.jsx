import React, { useEffect, useState } from "react";
import {
  getAllPlants,
  addPlant,
  updatePlant,
  deletePlant,
} from "../services/admin/plantService";
import { toast } from "sonner";
import {
  Spinner,
  PencilSimple,
  TrashSimple,
  PlusCircle,
  CheckCircle,
  X,
  Plant,
  CaretLeft,
  CaretRight,
  Star,
  ShieldCheck,
  Tag,
  WarningCircle,
  MagnifyingGlass,
} from "@phosphor-icons/react";

const categoryList = [
  { name: "INDOOR", id: 1, label: "Indoor{INDOOR}" },
  { name: "OUTDOOR", id: 2, label: "Outdoor{OUTDOOR}" },
  { name: "SUCCULENT", id: 7, label: "Decorative{SUCCULENT}" },
  { name: "FLOWER", id: 5, label: "Flowering{FLOWER}" },
  { name: "HERBAL", id: 8, label: "Herbal{HERBAL}" },
  { name: "MEDICAL", id: 9, label: "Medical{MEDICAL}" },
];

const getCategoryLabel = (id) => {
  const found = categoryList.find((c) => c.id === id);
  return found ? found.label : "Unknown";
};

const AdminPlantManagement = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "",
    description: "",
    price: "",
    categoryId: "",
    bestSeller: false,
    verified: false,
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPlants();
  }, [page, searchQuery]);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const res = await getAllPlants({ page, size: 6, search: searchQuery });
      setPlants(res.data.plants);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to fetch plants");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("type", form.type);
    formData.append("description", form.description);
    formData.append("price", parseFloat(form.price));
    formData.append("categoryId", form.categoryId);
    formData.append("bestSeller", form.bestSeller ? "true" : "false");
    formData.append("verified", form.verified ? "true" : "false");

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (editingId) {
        await updatePlant(editingId, formData);
        toast.success("Plant updated");
      } else {
        await addPlant(formData);
        toast.success("Plant added");
      }
      resetForm();
      fetchPlants();
    } catch (err) {
      toast.error("Failed to submit plant");
      console.error(err.response?.data || err.message);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      type: "",
      description: "",
      price: "",
      categoryId: "",
      bestSeller: false,
      verified: false,
      image: null,
    });
    setEditingId(null);
    setImagePreview(null);
    setShowForm(false);
  };

  const handleEdit = (plant) => {
    setForm({
      name: plant.name,
      type: plant.type,
      description: plant.description,
      price: plant.price,
      categoryId: plant.categoryId,
      bestSeller: plant.bestSeller,
      verified: plant.verified,
      image: null,
    });
    setEditingId(plant.id);
    setImagePreview(plant.imagePath);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await deletePlant(deleteId);
      toast.success("Plant deleted");
      fetchPlants();
    } catch {
      toast.error("Delete failed");
    } finally {
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const handleToggle = (field) => {
    setForm({ ...form, [field]: !form[field] });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6 shadow-xl hover:shadow-2xl cursor-pointer">
      {/* Header and Search */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Plant size={28} className="text-green-500"/> Plant Management
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-2xl hover:bg-green-500 shadow-xl hover:shadow-2xl cursor-pointer"
        >
         < PlusCircle size={18} /> {showForm ? "Close" : "Add"}
        </button>
      </div>

      <div className="relative w-full md:w-1/3">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <MagnifyingGlass size={18} />
        </span>
        <input
          type="text"
          placeholder="Search by plant name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm shadow-xl hover:shadow-2xl cursor-pointer"
        />
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="relative border rounded-lg p-6 bg-gray-50">
          <button
            onClick={resetForm}
            className="absolute top-1 right-1 text-gray-500 hover:text-red-500"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded-xl shadow-xl hover:shadow-2xl cursor-pointer"
              type="text"
              placeholder="Plant name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: parseInt(e.target.value) })
              }
              className="block w-full bg-white border border-gray-500 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-500 cursor-pointer hover:border-green-500 transition shadow-xl hover:shadow-2xl"
            >
              <option value="">Select Category</option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            <input
              className="border p-2 rounded-xl shadow-xl hover:shadow-2xl cursor-pointer"
              type="text"
              placeholder="Type (e.g. INDOOR)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <input
              className="border p-2 rounded-xl shadow-xl hover:shadow-2xl cursor-pointer"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <textarea
              className="border p-2 rounded-xl md:col-span-2 shadow-xl hover:shadow-2xl cursor-pointer"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            ></textarea>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-500 rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-full file:bg-green-100 file:text-green-600 hover:file:bg-green-100 shadow-xl hover:shadow-2xl transition cursor-pointer"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-xl"
              />
            )}

            <div className="flex items-center gap-6 md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.bestSeller}
                  onChange={() => handleToggle("bestSeller")}
                />
                <Star size={16} weight="fill" className="text-yellow-500" /> Best Seller
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.verified}
                  onChange={() => handleToggle("verified")}
                />
                <ShieldCheck size={16} weight="fill" className="text-blue-500" /> Verified
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 shadow-lg hover:shadow-xl"
            >
              {editingId ? "Update" : "Add"} Plant
            </button>
          </div>
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="flex justify-center py-10 ">
          <Spinner size={32} className="animate-spin text-green-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer ">
          {plants.map((plant) => (
            <div
              key={plant.id}
              className="group relative border p-4 rounded-xl shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={plant.imagePath}
                alt={plant.name}
                className="h-49 w-full object-cover rounded-xl"
              />
              <div className="absolute top-5 right-5 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(plant)}
                  className="text-blue-500 hover:text-blue-600 "
                >
                  <PencilSimple size={18} />
                </button>
                <button
                  onClick={() => {
                    setDeleteId(plant.id);
                    setShowDeleteDialog(true);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <TrashSimple size={18} />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mt-2">
                {plant.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {plant.description}
              </p>
              <p className="text-xs text-gray-500">
                Quantity: {plant.quantity ?? "N/A"}
              </p>
              <span className="flex items-center text-xs font-medium text-red-500 gap-1">
                <Tag size={14} /> {getCategoryLabel(plant.categoryId)}
              </span>
              <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1 font-medium">
                  ₹{plant.price}
                </span>
              </div>
              <div className="flex gap-2 text-xs mt-2">
                {plant.bestSeller && (
                  <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium gap-1 shadow-lg cursor-pointer hover:shadow-xl">
                    🌟 Best Seller
                  </span>
                )}
                {plant.verified && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium gap-1 shadow-lg cursor-pointer hover:shadow-xl">
                    <CheckCircle size={14} /> Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6 text-sm font-medium">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="text-gray-600 disabled:opacity-30 hover:text-green-600 transition shadow-xl rounded-full hover:shadow-2xl cursor-pointer"
        >
          <CaretLeft size={22} />
        </button>
        <span className="text-gray-700">
          Page {page + 1} of {totalPages}
        </span>
        <button
          disabled={page + 1 === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="text-gray-800 disabled:opacity-30 hover:text-green-600 transition shadow-xl rounded-full hover:shadow-2xl cursor-pointer"
        >
          <CaretRight size={22} />
        </button>
      </div>

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-5 bg-black bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-sm text-center relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteId(null);
              }}
            >
              <X size={18} />
            </button>
            <WarningCircle size={36} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this plant?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlantManagement;
