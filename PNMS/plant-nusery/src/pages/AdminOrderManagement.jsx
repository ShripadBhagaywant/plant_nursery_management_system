import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog } from "@headlessui/react";
import {
  MagnifyingGlass,
  Trash,
  Pencil,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Package,
  ArrowRight,
  Spinner,
  X,
  Grains 
} from "@phosphor-icons/react";
import {
  getAllOrders,
  deleteOrder,
  updateOrder,
} from "../services/admin/orderService";

// Status mappings
const statusStyles = {
  PENDING: { color: "bg-yellow-100 text-yellow-800", icon: <Clock size={16} className="text-yellow-500" /> },
  CONFIRMED: { color: "bg-blue-100 text-blue-800", icon: <CheckCircle size={16} className="text-blue-500" /> },
  SHIPPED: { color: "bg-indigo-100 text-indigo-800", icon: <Truck size={16} className="text-indigo-500" /> },
  DELIVERED: { color: "bg-green-100 text-green-800", icon: <Package size={16} className="text-green-600" /> },
  CANCELLED: { color: "bg-red-100 text-red-800", icon: <XCircle size={16} className="text-red-600" /> },
};

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, orderId: null });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch {
      toast.error("❌ Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrder(deleteDialog.orderId);
      toast.success("🗑️ Order deleted");
      fetchOrders();
    } catch {
      toast.error("❌ Failed to delete order");
    } finally {
      setDeleteDialog({ open: false, orderId: null });
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    if (["CANCELLED", "DELIVERED"].includes(selectedOrder.status)) {
      toast.error("⚠️ Cannot update a delivered or cancelled order");
      return;
    }

    try {
      await updateOrder(selectedOrder.orderId, { orderStatus: newStatus });
      toast.success("✅ Order status updated");
      setIsDialogOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "❌ Failed to update status");
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.recipientName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-poppins p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Grains  size={25} className="text-green-400" />
          Orders
        </h2>

        <div className="relative w-full sm:w-80 shadow-lg rounded-full">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" size={20} />
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Loading or Orders */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spinner className="animate-spin text-green-600" size={32} />
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="bg-white shadow-xl p-4 rounded-2xl cursor-pointer space-y-3">
              <div className="flex justify-between">
                <h4 className="text-lg font-semibold">#{order.orderId}</h4>
                <span className={`text-xs px-3 py-1 rounded-full shadow-lg ${statusStyles[order.status].color}`}>
                  {order.status}
                </span>
              </div>

              <p><span className="font-semibold">Name:</span> {order.recipientName}</p>
              <p><span className="font-semibold">Amount:</span> ₹{order.totalAmount.toFixed(2)}</p>
              <p><span className="font-semibold">Date:</span> {new Date(order.orderDate).toLocaleDateString()}</p>

              {order.statusHistory?.length > 0 && (
                <div className="pt-2">
                  <h5 className="text-sm font-medium mb-1 text-gray-700">Status Timeline:</h5>
                  <ul className="space-y-1 border-l-2 border-gray-200 pl-3">
                    {order.statusHistory.map((entry, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        {statusStyles[entry.status]?.icon}
                        <span className="font-medium">{entry.status}</span>
                        <ArrowRight size={14} className="text-gray-400 shadow rounded-full" />
                        <span className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setNewStatus(order.status);
                    setIsDialogOpen(true);
                  }}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 shadow-lg"
                >
                  <Pencil size={18} className="text-blue-600" />
                </button>
                <button
                  onClick={() => setDeleteDialog({ open: true, orderId: order.orderId })}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 shadow-lg"
                >
                  <Trash size={18} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Status Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center font-poppins">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4 relative">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold">Update Order Status</h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none"
            >
              {Object.keys(statusStyles).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 rounded-full border"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-green-600 text-white rounded-full"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, orderId: null })}>
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 font-poppins">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg space-y-4 text-center relative">
            
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              onClick={() => setDeleteDialog({ open: false, orderId: null })}
              aria-label="Close modal"
            >
              <X size={22} />
            </button>

            <XCircle className="mx-auto text-red-500" size={40} />
            <h3 className="text-lg font-semibold text-gray-800">Delete this order?</h3>
            <p className="text-gray-500">This action cannot be undone.</p>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteDialog({ open: false, orderId: null })}
                className="px-4 py-2 border rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-full"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminOrderManagement;
