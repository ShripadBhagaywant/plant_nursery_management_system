import React, { useEffect, useState } from "react";
import {
  fetchAllUsers,
  blockUserById,
  unblockUserById,
} from "../services/admin/userService";
import UserCards from "../components/UserCards";
import { toast } from "sonner";
import {
  Spinner,
  MagnifyingGlass,
  User as UserIcon,
} from "@phosphor-icons/react";

const usersPerPage = 5;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    try {
      if (isBlocked) {
        await unblockUserById(userId);
        toast.success("User unblocked");
      } else {
        await blockUserById(userId);
        toast.success("User blocked");
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_blocked: !isBlocked } : u
        )
      );
    } catch {
      toast.error("Action failed");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
    );
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    setDisplayedUsers(filtered.slice(start, end));
  }, [searchTerm, users, currentPage]);

  const totalPages = Math.ceil(
    users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
    ).length / usersPerPage
  );

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-center lg:text-left">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <UserIcon size={22} className="text-green-500" /> Users Management.
          </h2>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm mx-auto lg:mx-0">
          <MagnifyingGlass className="absolute top-3 left-3 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by name or email"
            className="w-full pl-10 pr-3 py-2 rounded-full border text-sm shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex justify-center items-center gap-2 text-gray-500 py-8">
          <Spinner size={20} className="animate-spin" />
          <span>Loading...</span>
        </div>
      ) : displayedUsers.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No users found</p>
      ) : (
        <>
          <UserCards users={displayedUsers} onBlockToggle={handleBlockToggle} />

          {/* Pagination */}
          <div className="mt-6 flex justify-center items-center gap-3 text-sm text-gray-600">
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <span>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
