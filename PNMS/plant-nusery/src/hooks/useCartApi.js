import { useEffect, useState } from "react";
import { cartService } from "../services/cartService";
import { useAuth } from "../context/AuthContext";

const useCart = () => {
  const { user } = useAuth(); // contains userId from token
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await cartService.getCart(user.id);
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return { cart, setCart, loading, fetchCart };
};

export default useCart;
