import React, { useState } from "react";
import useCart from "../../hooks/useCartApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { toast } from "sonner";

const PlaceOrder = () => {
  const { cartItems, clearCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    recipientName: "",
    phoneNumber: "",
    shippingAddress: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    return Object.values(form).every((field) => field.trim() !== "");
  };

  const handlePlaceOrder = async (e) => {
  e.preventDefault();

  if (!auth?.id) {
    toast.error("User not authenticated");
    return;
  }

  if (!cartItems.length) {
    toast.error("Cart is empty!");
    return;
  }

  if (!validateForm()) {
    toast.error("Please fill all required fields.");
    return;
  }

  const items = cartItems.map(({ id, quantity }) => ({
    plantId: id,
    quantity,
  }));

  const orderData = {
    userId: auth.id,
    ...form,
    items,
  };

  try {
    const res = await orderService.placeOrder(orderData); // ✅ FIXED
    toast.success("✅ Order placed successfully!");
    clearCart();
    navigate('/myOrders');
  } catch (err) {
    toast.error(err?.response?.data?.message || "❌ Order failed");
  }
};


  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>
      <form
        onSubmit={handlePlaceOrder}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md"
      >
        {["recipientName", "phoneNumber", "shippingAddress", "city", "state", "country", "zipCode"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase())}
            value={form[field]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        ))}

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
