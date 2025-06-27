import React, { useEffect, useState } from "react";
import {
  createCategory,
  searchCategories,
  deleteCategory,
  updateCategory,
} from "../services/admin/categoryService";
import { toast } from "sonner";
import categoryEnum from "../utils/categoryEnum";
import {
  PencilSimple,
  Trash,
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
  Plant,
  X,
  Spinner,
  Pen ,
  FlowerLotus ,
  Leaf ,
  PottedPlant,
  TreePalm,
  FlowerTulip,
  Article ,
  CaretLineDown      
} from "@phosphor-icons/react";

const categoryIcons = {
  INDOOR: <Plant size={20} className="text-green-600" />,
  OUTDOOR: <TreePalm   size={20} className="text-blue-600" />,
  SUCCULENT: <PottedPlant  size={20} className="text-teal-600" />,
  FLOWER: <FlowerLotus  size={20} className="text-pink-600" />,
  HERBAL: <Leaf  size={20} className="text-lime-600" />,
  MEDICAL: <FlowerTulip  size={20} className="text-purple-600" />,
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ type: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [page, search]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await searchCategories(search, page, size);
      setCategories(res.data.categories);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!form.type || !form.description)
      return toast.error("All fields are required");

    try {
      if (editingId) {
        await updateCategory(editingId, form);
        toast.success("Category updated successfully");
      } else {
        await createCategory(form);
        toast.success("Category created successfully");
      }
      setForm({ type: "", description: "" });
      setEditingId(null);
      fetchCategories();
    } catch {
      toast.error("Error submitting category");
    }
  };

  const handleEdit = (category) => {
    setForm({ type: category.name, description: category.description });
    setEditingId(category.id);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteCategory(confirmDelete);
      toast.success("Category deleted");
      setConfirmDelete(null);
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="bg-white p-3 rounded-2xl shadow-2xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
        <Article  size={24} className="text-green-600" /> Category Management
      </h2>

      {/* Search Bar */}
      <div className="w-full lg:w-80 xl:w-96 relative ">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 cursor-pointer">
          <MagnifyingGlass size={18} />
        </span>
        <input
          type="text"
          placeholder="Search by category type or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 hover:shadow-xl cursor-pointer"
        />
      </div>

      {/* Mobile Drawer Toggle */}
      <div className="md:hidden flex justify-end">
        <button
          onClick={() => setDrawerOpen(true)}
          className="bg-green-500 text-white px-3 py-1 rounded-full shadow-xl hover:shadow-lg hover:bg-green-600"
        >
          Choose Category Type
        </button>
      </div>

      {/* Mobile + Tablet Form */}
      <div className="flex flex-col gap-4 md:hidden">
        <input
          type="text"
          placeholder="Enter short description"
          className="border px-3 py-2 rounded-full w-full shadow-sm hover:shadow-xl"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button
          onClick={handleCreateOrUpdate}
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 shadow-lg hover-shadow-xl w-fit"
        >
          {editingId ? "Update" : "Create"}
        </button>
      </div>
      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-10 z-20 flex justify-end ">
          <div className="w-72 bg-white shadow-2xl rounded-xl max-h-[60vh] p-6 overflow-y-auto relative">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h4 className="text-lg font-semibold mb-4">Select Category Type</h4>
            {Object.entries(categoryEnum).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  setForm({ ...form, type: key });
                  setDrawerOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg mb-2 shadow-md transition-all ${
                  form.type === key
                    ? "bg-green-100 text-green-800 ring-2 ring-green-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {categoryIcons[key]} {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Sidebar + Form */}
      <div className="hidden md:flex gap-6 cursor-pointer">
        {/* Sidebar */}
        <div className="flex flex-col gap-3  p-3 rounded-2xl shadow-lg hover:shadow-lg w-1/4 h-fit">
          <div className="flex items-center gap-2 ">
            <h4 className="text-lg text-gray-500 font-medium">Select Categories</h4>
            <CaretLineDown size={18} className="text-gray-500" />
          </div>
          {Object.entries(categoryEnum).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setForm({ ...form, type: key })}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-all shadow-lg cursor-pointer ${
                form.type === key
                  ? "bg-green-100 text-green-700 ring-2 ring-green-300"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              {categoryIcons[key]} {label}
            </button>
          ))}
        </div>

        {/* Form beside Sidebar */}
        <div className="flex-1 flex flex-col gap-4 shadow-sm rounded-xl bg-gray-200">
          <div className="flex items-center gap-2 mt-2 ml-8">
            <Pen size={20} className="text-gray-500" />
            <h4 className="text-lg text-gray-500 font-medium">Write short description</h4>
          </div>
          <textarea
            placeholder="Enter short description..."
            className="border px-4 mt-5 ml-8 py-3 rounded-xl w-[550px] h-[80px] shadow-lg hover:shadow-xl resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button
            onClick={handleCreateOrUpdate}
            className="bg-orange-500 ml-9 text-white px-4 py-2 rounded-lg hover:bg-green-500 shadow-xl w-fit"
          >
            {editingId ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* Category Cards */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size={32} className="animate-spin text-green-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 border rounded-xl shadow-lg bg-gray-50 space-y-2 relative hover:shadow-2xl"
            >
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-500 hover:text-blue-600 shadow-sm rounded"
                >
                  <PencilSimple size={20} />
                </button>
                <button
                  onClick={() => setConfirmDelete(cat.id)}
                  className="text-red-500 hover:text-red-600 shadow-sm rounded"
                >
                  <Trash size={20} />
                </button>
              </div>
              <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                {categoryIcons[cat.type]} {categoryEnum[cat.type] || cat.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {cat.description || "No description provided"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-2">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="text-gray-500 hover:text-gray-800 disabled:text-gray-500 shadow rounded"
        >
          <CaretLeft size={20} />
        </button>
        <span className="text-sm text-gray-700">
          Page {page + 1} of {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="text-gray-500 hover:text-gray-800 disabled:text-gray-500 shadow rounded"
        >
          <CaretRight size={20} />
        </button>
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-4 z-10 flex items-center justify-center bg-black bg-opacity-10">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              onClick={() => setConfirmDelete(null)}
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this category?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
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

export default CategoryManagement;
