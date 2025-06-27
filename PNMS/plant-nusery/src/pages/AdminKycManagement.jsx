import React, { useEffect, useState } from "react";
import { fetchAllKycs, updateKycStatus } from "../services/admin/KycService";
import KycCards from "../components/KycCards";
import { toast } from "sonner";
import {
  Spinner,
  CaretRight,
  CaretLeft,
  MagnifyingGlass,
  IdentificationBadge
} from "@phosphor-icons/react";

const AdminKycManagement = () => {
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize] = useState(10);

  const loadKycs = async () => {
    setLoading(true);
    try {
      const data = await fetchAllKycs(0, 1000); 
      setKycs(data.content);
    } catch (error) {
      toast.error("Failed to load KYC records");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (kycId, status) => {
    try {
      await updateKycStatus(kycId, status);
      toast.success(`KYC ${status.toLowerCase()}`);
      loadKycs();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  useEffect(() => {
    loadKycs();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(0);
  };

  // Filter KYC records by ID or status
  const filteredKycs = kycs.filter((kyc) => {
    const userIdMatch =
      kyc.userId && kyc.userId.toString().toLowerCase().includes(searchTerm);
    const statusMatch =
      kyc.status && kyc.status.toLowerCase().includes(searchTerm);
    return userIdMatch || statusMatch;
});


  const totalPages = Math.ceil(filteredKycs.length / pageSize);
  const paginatedKycs = filteredKycs.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <IdentificationBadge  size={25} className="text-green-400" />
          Kyc's Management
        </h2>

      {/* Search Bar */}
      <div className="w-full lg:w-80 xl:w-96 relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 ">
          <MagnifyingGlass size={18} className="sm:w-5 sm:h-5" />
        </span>
        <input
          type="text"
          placeholder="Search by User ID or Status"
          className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 text-sm sm:text-base rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all hover:shadow-xl cursor-pointer"
          onChange={handleSearch}
          value={searchTerm}
        />
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <p className="text-center text-gray-500 flex items-center justify-center gap-2 py-8">
          <Spinner size={20} className="sm:w-6 sm:h-6 animate-spin" />
          <span className="text-sm sm:text-base">Loading...</span>
        </p>
      ) : paginatedKycs.length === 0 ? (
        <p className="text-gray-500 text-center">No KYC applications found.</p>
      ) : (
        <KycCards kycs={paginatedKycs} onStatusChange={handleStatusChange} />
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="px-4 py-2 border rounded-lg bg-white text-sm disabled:opacity-50 shadow-lg hover:shadow-xl cursor-pointer"
        >
          <CaretLeft size={15} />
        </button>
        <span className="text-sm font-medium text-gray-700">
           Page {currentPage + 1} of {totalPages || 1} 
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage + 1 >= totalPages}
          className="px-4 py-2 border rounded-lg bg-white text-sm disabled:opacity-50 shadow-lg  hover:shadow-xl cursor-pointer"
        >
          <CaretRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default AdminKycManagement;
