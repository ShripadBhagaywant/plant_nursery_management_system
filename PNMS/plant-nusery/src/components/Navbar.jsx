import React, { useState } from "react";
import logo from "../assets/Plant Logo.png";
import { ListHeart, XCircle , ShoppingBagOpen } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import  { useCart } from "../context/CartContext";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 fixed top-0 w-full z-50 rounded-b-xl font-poppins">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full border border-green-500 shadow-lg hover:shadow-xl cursor-pointer" />
          <h1 className="text-xl font-semibold  text-green-500">Plant Nursery</h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-gray-700 mx-auto">
          <li><Link to="/home" className="hover:text-green-600">Home</Link></li>
          <li><Link to="/plants" className="hover:text-green-600">Plants</Link></li>
          <li><Link to="/orders" className="hover:text-green-600">Orders</Link></li>
          <li><Link to="/inventory" className="hover:text-green-600">Inventory</Link></li>
          <li><Link to="/contact" className="hover:text-green-600">Contact</Link></li>
        </ul>

        {/* Cart & Auth */}
        <div className="hidden md:flex items-center space-x-6">
          <button onClick={() => navigate("/cart")} className="relative text-red-500 hover:text-red-600">
            <ShoppingBagOpen size={26} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-1">
                {cartItems.length}
              </span>
            )}
          </button>

          {auth ? (
            <button onClick={handleLogout} className="text-red-500 font-medium hover:text-red-600">
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-green-500 font-medium  hover:text-green-600">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-red-500">
            {menuOpen ? <XCircle  size={28} /> : <ListHeart size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col gap-4 mt-4 text-center bg-white py-4 rounded shadow-md text-gray-700 font-medium ">
          <li><Link to="/home" onClick={() => setMenuOpen(false)} className="hover:text-green-600">Home</Link></li>
          <li><Link to="/plants" onClick={() => setMenuOpen(false)} className="hover:text-green-600">Plants</Link></li>
          <li><Link to="/orders" onClick={() => setMenuOpen(false)} className="hover:text-green-600">Orders</Link></li>
          <li><Link to="/inventory" onClick={() => setMenuOpen(false)} className="hover:text-green-600">Inventory</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-green-600">Contact</Link></li>
          <li>
            <button onClick={() => { navigate("/cart"); setMenuOpen(false); }} className="hover:text-green-600">
              Cart ({cartItems.length})
            </button>
          </li>
          {auth ? (
            <li>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="hover:text-red-600">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-green-600">
                Login
              </Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
