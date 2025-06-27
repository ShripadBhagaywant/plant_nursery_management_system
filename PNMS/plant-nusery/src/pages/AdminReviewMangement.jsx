import React, { useEffect, useState } from "react";
import {
  getAllReviewsForAdmin,
  deleteReviewById,
} from "../services/admin/reviewService";
import { toast } from "sonner";
import {
  Trash,
  XCircle,
  Star,
  User,
  Leaf,
  MagnifyingGlass,
  ArrowLeft,
  ArrowRight,
  Spinner,
} from "@phosphor-icons/react";

const pageSize = 6;

const AdminReviewManagement = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [filters, setFilters] = useState({ username: "", plantName: "", rating: "" });
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const filteredReviews = allReviews.filter((r) => {
    const matchUsername = filters.username === "" || r.username.toLowerCase().includes(filters.username.toLowerCase());
    const matchPlant = filters.plantName === "" || r.plantName.toLowerCase().includes(filters.plantName.toLowerCase());
    const matchRating = filters.rating === "" || r.rating === parseInt(filters.rating);
    return matchUsername && matchPlant && matchRating;
  });

  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const paginatedReviews = filteredReviews.slice(page * pageSize, (page + 1) * pageSize);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await getAllReviewsForAdmin();
      setAllReviews(res.data);
    } catch (err) {
      toast.error("Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReviewById(selectedReviewId);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setShowDialog(false);
      setSelectedReviewId(null);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="bg-white shadow rounded-xl p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Star size={22} weight="fill" className="text-yellow-300" />
        All Reviews
      </h2>


      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative">
          <MagnifyingGlass className="absolute top-2.5 left-2 text-gray-800" size={18} />
          <input
            name="username"
            placeholder="Search by user"
            className="border pl-8 pr-3 py-1 rounded-xl cursor-pointer shadow-lg hover:shadow-xl"
            value={filters.username}
            onChange={handleChange}
          />
        </div>
        <div className="relative">
          <MagnifyingGlass className="absolute top-2.5 left-2 text-gray-800" size={18} />
          <input
            name="plantName"
            placeholder="Search by plant"
            className="border pl-8 pr-3 py-1 rounded-xl cursor-pointer shadow-lg hover:shadow-xl"
            value={filters.plantName}
            onChange={handleChange}
          />
        </div>
        <select
          name="rating"
          className="border px-7 py-1 rounded-full cursor-pointer shadow-lg hover:shadow-xl"
          value={filters.rating}
          onChange={handleChange}
        >
          <option value="">All Ratings</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r} Star</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <Spinner size={32} className="animate-spin text-green-500" />
          </div>
        ) : paginatedReviews.length > 0 ? (
          paginatedReviews.map((r) => (
            <div key={r.id} className="border rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition duration-300 relative">
              <div className="flex items-center gap-2 text-green-500">
                <User size={20}/> <span className="font-semibold">{r.username}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Leaf size={15} className="text-green-500" /> <span>{r.plantName}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-yellow-400">
                {[...Array(r.rating)].map((_, i) => <Star key={i} weight="fill" />)}
              </div>
              <p className="mt-2 text-sm text-gray-600 border-t pt-2">{r.comment}</p>
              <div className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</div>
              <button
                onClick={() => {
                  setSelectedReviewId(r.id);
                  setShowDialog(true);
                }}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash size={20} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-4">No reviews found.</p>
        )}
      </div>

      {/* Delete Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowDialog(false)}
            >
              <XCircle size={22} />
            </button>
            <h3 className="text-lg font-semibold text-red-600 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this review?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-1 border rounded text-sm hover:bg-gray-100"
                onClick={() => setShowDialog(false)}
              >Cancel</button>
              <button
                className="px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                onClick={handleDelete}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 border rounded disabled:opacity-50 flex items-center gap-1 shadow-lg cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-sm text-gray-600">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 border rounded disabled:opacity-50 flex items-center gap-1 shadow-lg cursor-pointer"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdminReviewManagement;
