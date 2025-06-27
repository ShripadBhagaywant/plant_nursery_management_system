import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { orderService } from "../services/orderService";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import CheckoutForm from "../components/CheckoutForm";

import {
  Handbag,
  Plant,
  Receipt,
  Gift,
  CurrencyInr,
  Truck,
  Percent,
  SealCheck,
  Trash,
  Plus,
  Minus,
} from "@phosphor-icons/react";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  // ✅ Custom Calculation Logic
  const itemTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const SHIPPING_CHARGE = 50;
  const TAX = Math.round(itemTotal * 0.18); // 18% GST
  const grandTotal = itemTotal + SHIPPING_CHARGE + TAX;

  const handleCheckoutFormSubmit = async (formData) => {
    try {
      const orderData = {
        userId: auth.id,
        items: cartItems.map((item) => ({
          plantId: item.id,
          quantity: item.quantity,
        })),
        itemTotal,
        shippingCharge: SHIPPING_CHARGE,
        tax: TAX,
        totalAmount: grandTotal,
        ...formData,
      };

      await orderService.placeOrder(orderData);
      toast.success("Order placed successfully!");
      clearCart();
      setShowCheckoutForm(false);
      navigate("/orders");
    } catch (error) {
      console.error("Order placement failed:", error);
      const res = error.response;
      const msg = res?.data?.message || "Something went wrong";

      if (res?.status === 409) {
        toast.error(`❌ ${msg}`);
      } else {
        toast.error(msg);
      }
    }
  };

  const renderCartItem = (item) => (
    <div
      key={item.id}
      className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
    >
      <div className="flex gap-4 items-center">
        <img
          src={item.imagePath}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg hover:scale-105 transition"
        />
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-300"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center font-medium text-gray-800">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-300"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-sm text-green-600 font-semibold mt-1">
            ₹{item.price}
          </p>
        </div>
      </div>

      <div className="text-right flex flex-col items-end gap-2">
        <span className="text-gray-800 font-semibold">
          ₹{item.price * item.quantity}
        </span>
        <button
          onClick={() => removeFromCart(item.id)}
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          title="Remove item"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-poppins">
      <Navbar />
      <div className="pt-24 pb-10 px-4 md:px-12">
        <div className="flex items-center gap-3 text-green-500 font-bold text-2xl mb-6">
          <Handbag size={30} />
          <h2 className="flex items-center gap-2">
            Cart
            {cartItems.length > 0 && (
              <span className="bg-green-400 text-white text-xs px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 text-lg flex items-center justify-center gap-2">
            Your wishlist is empty
            <Plant size={20} className="text-green-500" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col gap-4">
              {cartItems.map(renderCartItem)}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl h-fit">
              <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
                <Receipt size={24} className="text-green-600" />
                Summary
              </h3>

              <div className="border-t border-gray-200 my-3"></div>

              <div className="text-gray-600 space-y-3 mt-4">
                <SummaryRow
                  label="Subtotal"
                  value={itemTotal}
                  icon={<CurrencyInr size={18} />}
                />
                <SummaryRow
                  label="Shipping"
                  value={SHIPPING_CHARGE}
                  icon={<Truck size={18} />}
                />
                <SummaryRow
                  label="Tax"
                  value={TAX}
                  note="(18% GST)"
                  icon={<Percent size={18} />}
                />
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <PromoCodeInput />

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full bg-green-300 hover:bg-green-400 text-green-600 py-3 rounded-full font-semibold shadow-md flex items-center justify-center gap-2"
                >
                  <SealCheck size={20} />
                  Proceed to Checkout →
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-red-300 hover:bg-red-400 text-red-600 py-2 rounded-full font-medium shadow flex items-center justify-center gap-2"
                >
                  <Trash size={18} />
                  Clear Wishlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <Modal isOpen={showCheckoutForm} onClose={() => setShowCheckoutForm(false)}>
        <CheckoutForm onSubmit={handleCheckoutFormSubmit} />
      </Modal>
    </div>
  );
};

const SummaryRow = ({ label, value, note, icon }) => (
  <div className="flex justify-between items-center">
    <span className="flex items-center gap-2">
      {icon}
      {label}
    </span>
    <span>
      ₹{value}{" "}
      {note && <span className="text-xs text-gray-400 ml-1">{note}</span>}
    </span>
  </div>
);

const PromoCodeInput = () => (
  <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
      <Gift size={18} className="text-green-600" />
      Promo Code
    </label>
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Enter promo"
        className="px-3 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <button className="px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-green-600">
        Apply
      </button>
    </div>
  </div>
);

export default CartPage;
