import React, { useEffect, useState } from "react";
import {
  getFilteredContacts,
  resolveContactById,
  deleteContactById,
} from "../services/admin/contactService";
import {
  Spinner,
  CheckCircle,
  XCircle,
  EnvelopeSimple,
  Clock,
  User,
  ChatCenteredText,
  Trash,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { toast } from "sonner";

const statusBadge = (resolved) =>
  resolved ? (
    <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 shadow-lg cursor-pointer">
      <CheckCircle size={14} /> Resolved
    </span>
  ) : (
    <span className="text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 shadow-lg cursor-pointer">
      <Clock size={14} /> Unresolved
    </span>
  );

const AdminContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filterResolved, setFilterResolved] = useState("");
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await getFilteredContacts(page, 10, filterResolved);
      setContacts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (e) {
      toast.error("Failed to fetch contact messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    try {
      await resolveContactById(selectedContactId);
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContactId ? { ...contact, resolved: true } : contact
        )
      );
      toast.success("Marked as resolved.");
      setShowResolveDialog(false);
    } catch {
      toast.error("Failed to resolve contact.");
    }
  };

  const handleDelete = async () => {
    try {
      setDeletingId(selectedContactId);
      await deleteContactById(selectedContactId);
      setContacts((prev) => prev.filter((c) => c.id !== selectedContactId));
      toast.success("Contact deleted.");
    } catch {
      toast.error("Failed to delete contact.");
    } finally {
      setDeletingId(null);
      setShowDeleteDialog(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, filterResolved]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mr-2">
          <ChatCenteredText size={24} className="text-green-500"/>  Queries
        </h2>
        <div className="flex items-center gap-2 ">
            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 ml-5">
                Check Status:
            </label>
            <select
                id="statusFilter"
                className="border border-gray-300 rounded-full px-7 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg cursor-pointer"
                value={filterResolved}
                onChange={(e) => {
                setPage(0);
                setFilterResolved(e.target.value);
            }}
        >
                <option value="">All</option>
                <option value="true">Resolved</option>
                <option value="false">Unresolved</option>
            </select>
        </div>

      </div>

      {/* Contact Cards */}
      {loading ? (
        <div className="flex justify-center py-10 ">
          <Spinner size={28} className="animate-spin text-green-500" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No contact queries found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 cursor-pointer">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white border shadow-lg rounded-2xl p-5 transition hover:shadow-xl cursor-pointer"
            >
              {/* Header: Username + Status */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-red-500 font-medium">
                  <User size={18} />
                  {contact.name}
                </div>
                {statusBadge(contact.resolved)}
              </div>

              {/* Subject */}
              <div className="text-lg font-semibold text-gray-800 mt-2">
                {contact.subject}
              </div>

              <hr className="my-2" />

              {/* Email */}
              <p className="flex items-center text-sm text-green-600 gap-2">
                <EnvelopeSimple size={16} />
                {contact.email}
              </p>

              {/* Message */}
              <div className="mt-2 text-sm text-gray-700">
                <strong>Message:</strong>
                <p className="mt-1">{contact.message}</p>
              </div>

              {/* Time */}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(contact.createdAt).toLocaleString()}
              </p>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap mt-4">
                {!contact.resolved && (
                  <button
                    onClick={() => {
                      setSelectedContactId(contact.id);
                      setShowResolveDialog(true);
                    }}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded-full hover:bg-green-500 inline-flex items-center shadow-lg hover:shadow-xl"
                  >
                    <CheckCircle size={14} className="mr-1" /> Mark Resolved
                  </button>
                )}

                <a
                  href={`mailto:${contact.email}?subject=Reply: ${encodeURIComponent(
                    contact.subject
                  )}&body=Hello ${contact.name},\n\n`}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 inline-flex items-center mr-2 shadow-lg hover:shadow-xl"
                >
                  <PaperPlaneTilt size={14} className="mr-1" />
                  Reply
                </a>

                <button
                  onClick={() => {
                    setSelectedContactId(contact.id);
                    setShowDeleteDialog(true);
                  }}
                  disabled={deletingId === contact.id}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 disabled:opacity-50 inline-flex items-center shadow-lg hover:shadow-xl"
                >
                  <Trash size={14} className="mr-1" />
                  {deletingId === contact.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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

      {/* Resolve Dialog */}
      {showResolveDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setShowResolveDialog(false)}
            >
              <XCircle size={24} />
            </button>
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Mark as Resolved?
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to mark this query as resolved?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-sm rounded-full border text-gray-700"
                onClick={() => setShowResolveDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm rounded-full bg-green-600 text-white hover:bg-green-700"
                onClick={handleResolve}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-8 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setShowDeleteDialog(false)}
            >
              <XCircle size={24} />
            </button>
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Delete this contact?
            </h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone. Are you sure?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-sm rounded-full border text-gray-700"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm rounded-full bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactManagement;
