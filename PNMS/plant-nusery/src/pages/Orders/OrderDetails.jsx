import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { toast } from "sonner";
import Navbar from "../../components/Navbar";
import {
  Truck,
  Receipt,
  IdentificationBadge,
  ShoppingCartSimple,
  CurrencyInr,
  Clock,
  CheckCircle,
  Package,
  XCircle,
  ArrowRight,
  Spinner
} from "@phosphor-icons/react";

// status icon mapping
const statusIcons = {
  PENDING: <Clock size={18} className="text-yellow-500" />,
  CONFIRMED: <CheckCircle size={18} className="text-blue-500" />,
  SHIPPED: <Truck size={18} className="text-indigo-500" />,
  DELIVERED: <Package size={18} className="text-green-500" />,
  CANCELLED: <XCircle size={18} className="text-red-500" />,
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(id);
        setOrder(res?.data || res);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to fetch order details");
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <Navbar />
        <div className="pt-24 text-center text-green-600 text-lg flex justify-center items-center gap-2">
          <Spinner size={24} className="animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Navbar />

      <div className="pt-24 pb-10 px-4 md:px-12 max-w-5xl mx-auto">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 text-green-600 font-bold text-2xl mb-6">
            <Receipt size={30} />
            <h2>Order Details</h2>
          </div>

          <div className="mb-6 space-y-2 text-gray-800">
            <p className="text-lg font-medium">
              <span className="text-gray-600">Order ID:</span>{" "}
              {order.orderId || order.id}
            </p>
            <p>
              <Truck size={18} className="inline-block mr-1 text-blue-500" />
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>
            <p>
              <strong>Placed on:</strong>{" "}
              {order.orderDate
                ? new Date(order.orderDate).toLocaleString()
                : "N/A"}
            </p>
          </div>

          {/* 🧭 Status Timeline */}
          {Array.isArray(order.statusHistory) && order.statusHistory.length > 0 && (
            <div className="my-6">
              <h3 className="text-lg font-semibold mb-2 text-green-700 flex items-center gap-2">
                <Clock size={20} /> Status Timeline
              </h3>
              <ul className="space-y-2 border-l-2 border-gray-200 pl-4 ml-1">
                {order.statusHistory.map((entry, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span>{statusIcons[entry.status]}</span>
                    <span className="font-medium">{entry.status}</span>
                    <ArrowRight size={14} className="text-gray-500 shadow-lg rounded-full" />
                    <span className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-gray-200 my-4"></div>

          {/* 📦 Shipping */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-green-700">
              <IdentificationBadge size={22} />
              Shipping Details
            </h3>
            <div className="text-gray-700 text-sm space-y-1">
              <p>
                <strong>Name:</strong> {order.recipientName}
              </p>
              <p>
                <strong>Phone:</strong> {order.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress}, {order.city},{" "}
                {order.state}, {order.zipCode}, {order.country}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* 🛒 Items */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-green-700">
              <ShoppingCartSimple size={22} />
              Ordered Items
            </h3>

            {Array.isArray(order.items) && order.items.length > 0 ? (
              <div className="space-y-4 mt-4">
                {order.items.map((item, index) => (
                  <div
                    key={item.plantId || `item-${index}`}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.plantName || "Unknown Plant"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-green-600 font-semibold flex items-center gap-1">
                      <CurrencyInr size={16} /> {item.price}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">No items found in this order.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
