import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Home from "./pages/Home";
import About from "./pages/About"; 
import Contact from "./pages/Contact";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPasswordRequest from './pages/ResetPasswordRequest';
import ResetPassword from './pages/ResetPassword';
import VerifyOtp from './pages/VerifyOtp';
import Plant from './pages/Plant';
import UserInventory from './pages/UserInventory';
import CartPage from './pages/Cart';
import PaymentWrapper from'./pages/Orders/paymentWrapper';
import KycUploadFrom from './pages/kyc';
import PlaceOrder from './pages/Orders/PlaceOrder';
import MyOrders from './pages/Orders/MyOrders';
import OrderDetails from './pages/Orders/OrderDetails';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPasswordRequest />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password-form" element={<ResetPassword />} />
        <Route path="/plants" element={<Plant />} />
        <Route
          path="/kyc"
          element={
            <ProtectedRoute role="ROLE_USER">
              <KycUploadFrom />
            </ProtectedRoute>
          }
          />
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="ROLE_USER">
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute role="ROLE_USER">
              <UserInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Order-related routes placed INSIDE <Routes> */}
        <Route
          path="/place-order"
          element={
            <ProtectedRoute role="ROLE_USER">
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute role="ROLE_USER">
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute role="ROLE_USER">
              
                <OrderDetails />
              
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments/:orderId"
          element={
            <ProtectedRoute role="ROLE_USER">
              <PaymentWrapper />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster position="top-right" richColors className="font-poppins" />
    </>
  );
}

export default App;
