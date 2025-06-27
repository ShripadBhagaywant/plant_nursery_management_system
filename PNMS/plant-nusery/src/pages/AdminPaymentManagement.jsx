import React, { useEffect, useState } from "react";
import {
  getAllPayments,
  getRecentPayments,
  getPaymentsByStatus,
} from "../services/admin/paymentService";
import {
  Spinner,
  CurrencyInr,
  CalendarHeart ,
  IdentificationCard,
  SealCheck,
  WarningCircle,
  ClockCounterClockwise,
  Table,
  Coins,
  Money
} from "@phosphor-icons/react";
import { toast } from "sonner";

const statusStyles = {
  CREATED: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: <ClockCounterClockwise size={20} />,
  },
  PAID: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: <SealCheck size={20} />,
  },
  FAILED: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: <WarningCircle size={20} />,
  },
};

const AdminPaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (activeTab === "RECENT") fetchRecent();
    else if (statusFilter) fetchByStatus();
    else fetchAll(page);
  }, [activeTab, statusFilter, page]);

  const fetchAll = async (pg = 0) => {
    setLoading(true);
    try {
      const res = await getAllPayments(pg);
      setPayments(res.data.content || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Error fetching all payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecent = async () => {
    setLoading(true);
    try {
      const res = await getRecentPayments();
      setPayments(res.data);
      setTotalPages(1);
    } catch {
      toast.error("Error fetching recent payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchByStatus = async () => {
    setLoading(true);
    try {
      const res = await getPaymentsByStatus(statusFilter, page);
      setPayments(res.data.content || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Error filtering by status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header with Icon */}
      <div className="flex items-center gap-2 mb-6">
        <Coins size={50} className="p-1 rounded-full bg-yellow-100 hover:bg-yellow-200 shadow-lg text-yellow-400 hover:shadow-xl cursor-pointer" />
        <h2 className="text-xl font-bold text-gray-800">Payments</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3 ">
        <div className="flex gap-2 flex-wrap">
          <button
            className={`px-4 py-2 text-sm rounded-full border shadow-lg hover:shadow-xl ${
              activeTab === "ALL"
                ? "bg-green-500 text-white"
                : "border-green-500 text-green-600"
            }`}
            onClick={() => {
              setStatusFilter("");
              setActiveTab("ALL");
              setPage(0);
            }}
          >
            <Table size={16} className="inline-block mr-1" />
            All
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-full border shadow-lg hover:shadow-xl ${
              activeTab === "RECENT"
                ? "bg-blue-500 text-white"
                : "border-blue-500 text-blue-600"
            }`}
            onClick={() => {
              setStatusFilter("");
              setActiveTab("RECENT");
            }}
          >
            <ClockCounterClockwise size={16} className="inline-block mr-1 shadow-sm rounded-full hover:shadow-lg" />
            Recent
          </button>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setActiveTab("STATUS");
              setPage(0);
            }}
            className="border border-gray-300 px-8 py-1 rounded-full shadow-lg hover:shadow-xl cursor-pointer"
          >
            <option value="">Filter by Status</option>
            <option value="PAID">Paid</option>
            <option value="CREATED">Created</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Spinner */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={30} className="text-green-500 animate-spin" />
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center text-gray-500 py-6">No payments found</div>
      ) : (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 ">
          {payments.map((payment, idx) => {
            const statusStyle = statusStyles[payment.status] || {};
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl shadow-xl border hover:shadow-2xl cursor-pointer transition duration-300 space-y-3"
              >
                {/* Top section */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-green-500">
                   <span className="font-Bold ">Amount :</span>{" "}  ₹{payment.amount?.toFixed(2)}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium  shadow-lg cursor-pointer hover:shadow-xl ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {statusStyle.icon}
                    {payment.status}
                  </span>
                </div>

                {/* Separator */}
                <hr className="border-gray-200" />

                {/* Details */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center gap-4">
                    <IdentificationCard size={25}  className=" p-1 rounded-full bg-blue-100 hover:bg-blue-200 shadow-lg text-blue-500 hover:shadow-xl mb-2" />
                    <span className="font-medium">Order:</span>{" "}
                    {payment.razorpayOrderId}
                  </p>
                  <p className="flex items-center gap-4">
                    <Money size={25}  className="p-1 rounded-full bg-green-100 hover:bg-green-200 shadow-lg text-green-500 hover:shadow-xl mb-2"/>
                    <span className="font-medium">Payment:</span>{" "}
                    {payment.razorpayPaymentId || "N/A"}
                  </p>
                  <p className="flex items-center gap-4">
                    <CurrencyInr size={25}  className="p-1 rounded-full bg-yellow-100 hover:bg-yellow-200 shadow-lg text-yellow-500 hover:shadow-xl mb-2"/>
                    <span className="font-medium">Method:</span>{" "}
                    {payment.paymentMethod}
                  </p>
                  <p className="flex items-center gap-4">
                    <CalendarHeart  size={25} className="p-1 rounded-full bg-white hover:bg-red-200 shadow-lg text-red-500 hover:shadow-xl mb-2"  />
                    <span className="font-medium  ">Date:</span>{" "}
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {activeTab !== "RECENT" && totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-full text-sm border ${
                page === i
                  ? "bg-green-600 text-white"
                  : "text-green-600 border-green-400"
              }`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPaymentManagement;
