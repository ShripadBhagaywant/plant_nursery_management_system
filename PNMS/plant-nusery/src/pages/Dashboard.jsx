import React, { useState } from "react";
import {
  ListHeart,
  XCircle,
  House,
  Users,
  ShieldCheck,
  Plant,
  Bell,
  SignOut,
  Article,
  Package,
  ClipboardText,
  Money,
  Headset,
  ChatCircleDots ,
} from "@phosphor-icons/react";

import UserManagement from "./UserManagement";
import DashboardSummary from "../components/DashboardSummary";
import AdminKycManagement from "../pages/AdminKycManagement";
import CategoryManagement from "../pages/CategoryManagement";
import AdminPlantManagement from "../pages/AdminPlantManagement";
import AdminInventoryManagemnt from "../pages/AdminInventoryManagement";
import AdminOrderManagemnt from "../pages/AdminOrderManagement";
import AdminPaymentManagement from "../pages/AdminPaymentManagement";
import AdminContactManagement from "../pages/AdminContactManagement";
import AdminReviewManagement from "../pages/AdminReviewMangement"

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-3 cursor-pointer transition rounded-xl ${
      active
        ? "bg-green-100 text-green-500 font-semibold"
        : "hover:bg-gray-100 text-gray-600"
    }`}
  >
    <Icon size={20} weight={active ? "fill" : "regular"} />
    <span>{label}</span>
  </div>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <DashboardSummary />;
      case "Users":
        return <UserManagement />;
      case "KYC":
        return <AdminKycManagement />;
      case "Categories":
        return <CategoryManagement />;
      case "Plant":
        return <AdminPlantManagement />;
      case "Inventory":
        return <AdminInventoryManagemnt />;
      case "Orders":
        return <AdminOrderManagemnt />;
      case "Payments":
        return <AdminPaymentManagement />;
      case "Contact":
        return <AdminContactManagement />;
      case "Reviews":
        return <AdminReviewManagement />;  
      default:
        return null;
    }
  };

  const pages = [
    { icon: House, label: "Dashboard" },
    { icon: Users, label: "Users" },
    { icon: ShieldCheck, label: "KYC" },
    { icon: Article, label: "Categories" },
    { icon: Plant, label: "Plant" },
    { icon: Package, label: "Inventory" },
    { icon: ClipboardText, label: "Orders" },
    { icon: Money, label: "Payments" },
    { icon: Headset, label: "Contact" },
    {icon:ChatCircleDots , label:"Reviews"},
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-poppins">
      {/* Topbar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b shadow-sm sticky top-0 z-50">
        <h2 className="text-sm md:text-lg font-semibold text-gray-700">{activePage}</h2>
        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell size={24} className="text-green-500 hover:text-red-600 transition" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] -mt-1 -mr-1">
              3
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-1 px-3 py-1 border border-red-500 text-red-500 rounded-full text-sm hover:bg-red-500 hover:text-white transition"
          >
            <SignOut size={16} />
            <span>Logout</span>
          </button>
          <button className="z-50 md:hidden" onClick={toggleSidebar}>
            {sidebarOpen ? (
              <XCircle size={24} className="text-red-600" />
            ) : (
              <ListHeart size={24} className="text-green-600" />
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:static z-40 top-0 left-0 md:h-auto md:w-64 h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } overflow-y-auto md:overflow-visible`} // 👈 Scrollable only on mobile/tablet
        >
          <div className="flex flex-col gap-1 p-4 pt-20 md:pt-6">
            {pages.map(({ icon, label }) => (
              <React.Fragment key={label}>
                <SidebarItem
                  icon={icon}
                  label={label}
                  active={activePage === label}
                  onClick={() => {
                    setActivePage(label);
                    setSidebarOpen(false);
                  }}
                />
                <hr className="my-1" />
              </React.Fragment>
            ))}

            {/* Mobile Only Logout */}
            <div className="mt-4 md:hidden">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 border border-red-500 text-red-500 rounded-full text-sm hover:bg-red-500 hover:text-white transition"
              >
                <SignOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
