import React, { useEffect, useState } from "react";
import { orderService } from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  Receipt,
  ListChecks,
  WarningCircle,
  Trash,
  X,
} from "@phosphor-icons/react";
import { Dialog } from "@headlessui/react";

const MyOrders = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState(null); // "cancel" or "delete"

  useEffect(() => {
    if (auth?.id) {
      orderService
        .getOrdersByUser(auth.id)
        .then((res) => setOrders(res.data))
        .catch(() => toast.error("❌ Failed to fetch orders"));
    }
  }, [auth?.id]);

  const openDialog = (order, type) => {
    setSelectedOrder(order);
    setActionType(type);
    setIsOpen(true);
  };

  const handleAction = async () => {
    if (!selectedOrder) return;

    try {
      if (actionType === "cancel") {
        await orderService.cancelOrder(selectedOrder.orderId);
        toast.success("✅ Order cancelled");
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === selectedOrder.orderId
              ? { ...o, status: "CANCELLED" }
              : o
          )
        );
      } else if (actionType === "delete") {
        await orderService.deleteOrder(selectedOrder.orderId);
        toast.success("🗑️ Order deleted");
        setOrders((prev) =>
          prev.filter((o) => o.orderId !== selectedOrder.orderId)
        );
      }
    } catch {
      toast.error(`❌ Failed to ${actionType} order`);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-poppins">
      <Navbar />

      <div className="pt-24 pb-10 px-4 md:px-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 text-green-600 font-bold text-2xl mb-6">
          <ListChecks size={30} />
          <h2>My Orders</h2>
        </div>

        {!orders.length ? (
          <div className="text-center text-gray-600 text-lg flex items-center justify-center gap-2">
            <WarningCircle size={24} className="text-yellow-500" />
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition space-y-4"
              >
                {/* Top Row */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Receipt size={20} className="text-green-500" />
                    Order ID: <span>{order.orderId}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Status: <span className="text-gray-800">{order.status}</span>
                  </div>
                </div>

                {/* Middle Row */}
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <p>
                    <strong>Items:</strong>{" "}
                    <span className="text-gray-800">
                      {order.items?.length || 0}
                    </span>
                  </p>

                  <div className="flex gap-3 items-center flex-wrap justify-end">
                    {/* Cancel Button */}
                    {["PLACED", "PENDING"].includes(order.status) && (
                      <button
                        onClick={() => openDialog(order, "cancel")}
                        className="text-yellow-600 hover:text-yellow-800 text-sm"
                      >
                        Cancel
                      </button>
                    )}

                    {/* Delete Button: NOT for DELIVERED */}
                    {order.status !== "DELIVERED" && (
                      <button
                        onClick={() => openDialog(order, "delete")}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <Trash size={14} />
                        Delete
                      </button>
                    )}

                    {/* View Details */}
                    <Link
                      to={`/order/${order.orderId}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Bottom Row - Pay Now Button */}
                {order.status === "PENDING" && (
                  <div className="pt-3">
                    <Link
                      to={`/payments/${order.orderId}`}
                      className="block w-full text-center bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition"
                    >
                      Pay Now
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog for Cancel / Delete Confirmation */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm font-poppins relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              <X size={18} />
            </button>
            <Dialog.Title className="text-lg font-semibold text-gray-800 mb-3">
              {actionType === "cancel" ? "Cancel Order" : "Delete Order"}
            </Dialog.Title>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to{" "}
              <span className="font-medium">{actionType}</span> this order?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
              >
                No, Go Back
              </button>
              <button
                onClick={handleAction}
                className={`px-4 py-2 rounded-md text-white text-sm ${
                  actionType === "cancel"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Yes, {actionType}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MyOrders;
