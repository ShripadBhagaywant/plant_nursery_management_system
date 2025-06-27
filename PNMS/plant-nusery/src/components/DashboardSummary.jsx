import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingCart,
  Coins,
  Leaf,
  Archive,
  ChatTeardropText,
  IdentificationCard,
  Star,
  Spinner ,
} from "@phosphor-icons/react";
import axiosInstance from "../services/axiosInstance";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Tailwind-safe color map
const colorMap = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
  pink: "bg-pink-100 text-pink-700",
  indigo: "bg-indigo-100 text-indigo-700",
  cyan: "bg-cyan-100 text-cyan-700",
};

// Summary Card Component
const SummaryCard = ({ icon: Icon, label, value, color, description, delta }) => {
  const colorClasses = colorMap[color] || "bg-gray-100 text-gray-700 ";

  return (
    <div className="flex flex-col justify-between p-5 rounded-2xl bg-white shadow hover:shadow-xl transition duration-300 border cursor-pointer">
      <div className="flex items-center gap-4 mb-3 ">
        <div className={`p-3 rounded-full shadow-lg hover:shadow-xl cursor-pointer ${colorClasses}`}>
          <Icon size={26} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {delta !== undefined && (
          <span
            className={`text-xs font-medium ${
              delta > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {delta > 0 ? `↑ ${delta}%` : `↓ ${Math.abs(delta)}%`}
          </span>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Summary Component
const DashboardSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard-summary");
        setSummary(response.data);
      } catch (error) {
        console.error("Failed to load dashboard summary", error);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-center text-gray-500 flex items-center justify-center gap-2">
                  <Spinner size={22} className="animate-spin" />
                  Loading dashboard summary
        </p>
      </div>
    );
  }

  const barData = [
    { name: "Users", value: summary.totalUsers },
    { name: "Orders", value: summary.totalOrders },
    { name: "Payments", value: summary.totalPayments },
    { name: "Plants", value: summary.totalPlants },
    { name: "Categories", value: summary.totalCategories || 0 },
    { name: "Feedbacks", value: summary.totalFeedBacks || 0 },
    { name: "KYCs", value: summary.totalKyc || 0 },
    { name: "Reviews", value: summary.totalReview || 0 },
  ];

  return (
    <div className="flex flex-col gap-8 mt-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        <SummaryCard
          icon={Users}
          label="Total Users"
          value={summary.totalUsers}
          color="blue"
          description="Registered users"
          delta={12}
        />
        <SummaryCard
          icon={ShoppingCart}
          label="Total Orders"
          value={summary.totalOrders}
          color="orange"
          description="Total orders placed"
          delta={8}
        />
        <SummaryCard
          icon={Coins}
          label="Total Payments"
          value={summary.totalPayments}
          color="yellow"
          description="Successful transactions"
          delta={15}
        />
        <SummaryCard
          icon={Leaf}
          label="Total Plants"
          value={summary.totalPlants}
          color="green"
          description="Available nursery plants"
          delta={5}
        />
        <SummaryCard
          icon={Archive}
          label="Total Categories"
          value={summary.totalCategories || 0}
          color="pink"
          description="Available plant categories"
          delta={3}
        />
        <SummaryCard
          icon={ChatTeardropText}
          label="Total Feedbacks"
          value={summary.totalFeedBacks || 0}
          color="purple"
          description="User feedback received"
          delta={2}
        />
        <SummaryCard
          icon={IdentificationCard}
          label="Total KYC"
          value={summary.totalKyc || 0}
          color="indigo"
          description="Verified users via KYC"
          delta={4}
        />
        <SummaryCard
          icon={Star}
          label="Total Reviews"
          value={summary.totalReview || 0}
          color="cyan"
          description="Product reviews submitted"
          delta={6}
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-5 rounded-2xl shadow-xl border hover:shadow-2xl cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Quick Stats Overview
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={barData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#10b981"
              barSize={40}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardSummary;
