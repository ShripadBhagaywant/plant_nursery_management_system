import React, { createContext, useContext, useState, useEffect } from "react";
import { cartService } from "../services/cartService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import auth to identify logged in user

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { auth } = useAuth(); // Get logged-in user
  const navigate = useNavigate();

  const localStorageKey = `cartItems-${auth?.id || "guest"}`;

  // Load cart from localStorage
  useEffect(() => {
  const storedCart = localStorage.getItem(localStorageKey);
  if (storedCart) {
    setCartItems(JSON.parse(storedCart));
  }
}, [localStorageKey]); 

  // Save to localStorage when cartItems changes
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(cartItems));
  }, [cartItems, localStorageKey]);

  const addToCart = async (userId, plant) => {
    try {
      await cartService.addToCart(userId, {
        plantId: plant.id,
        quantity: 1,
      });

      setCartItems((prevItems) => {
        const exists = prevItems.find((item) => item.id === plant.id);
        if (exists) {
          return prevItems.map((item) =>
            item.id === plant.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { ...plant, quantity: 1 }];
        }
      });

      toast.success(`${plant.name} added to cart!`);
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed", error);
      toast.error("Failed to add to cart.");
    }
  };

  const updateQuantity = (plantId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === plantId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (plantId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== plantId)
    );
    toast.success("Item removed from cart.");
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(localStorageKey);
    toast.success("Cart cleared.");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
