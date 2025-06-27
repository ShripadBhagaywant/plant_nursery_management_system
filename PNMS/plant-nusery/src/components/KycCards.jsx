import React, { useState } from "react";
import {
  ShieldCheck,
  XCircle,
  Eye,
  X,
  WarningCircle,
  FileText,
} from "@phosphor-icons/react";
import { Dialog } from "@headlessui/react";

const BASE_IMAGE_URL = "http://localhost:8080/uploads";

const KycCardView = ({ kycs, onStatusChange }) => {
  const [preview, setPreview] = useState(null);
  const [statusDialog, setStatusDialog] = useState({ show: false, kycId: null, status: null });

  const handleStatusDialog = (kycId, status) => {
    setStatusDialog({ show: true, kycId, status });
  };

  const confirmStatusChange = () => {
    if (statusDialog.kycId && statusDialog.status) {
      onStatusChange(statusDialog.kycId, statusDialog.status);
    }
    setStatusDialog({ show: false, kycId: null, status: null });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {kycs.map((kyc, i) => (
        <div
          key={kyc.id}
          className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-200 flex flex-col justify-between border border-gray-100"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-green-400">#{i + 1}</p>
              <FileText size={16} className="text-gray-600 shadow-sm rounded-sm hover:shadow-xl cursor-pointer"  />
            </div>
            <p className="text-base font-bold text-gray-800">User ID: {kyc.userId}</p>
            <p className="text-sm text-gray-600">Document: {kyc.documentType}</p>
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full font-medium mt-1 shadow-lg hover:shadow-xl cursor-pointer ${
                kyc.status === "APPROVED"
                  ? "bg-green-100 text-green-600"
                  : kyc.status === "REJECTED"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {kyc.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-5 font-poppins">
            <button
              onClick={() => handleStatusDialog(kyc.id, "APPROVED")}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1 text-xs rounded-xl border border-green-500 text-green-600 hover:bg-green-50 shadow-lg p-5 hover:shadow-xl "
            >
              <ShieldCheck size={15} /> Approve
            </button>
            <button
              onClick={() => handleStatusDialog(kyc.id, "REJECTED")}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1 text-xs rounded-xl border border-red-500 text-red-600 hover:bg-red-50 shadow-lg p-5 hover:shadow-xl"
            >
              <XCircle size={15} /> Reject
            </button>
            <button
              onClick={() => setPreview(kyc)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1 text-xs rounded-xl border border-gray-400 text-gray-600 hover:bg-gray-100 shadow-lg p-5 hover:shadow-xl"
            >
              <Eye size={15} /> Preview
            </button>
          </div>
        </div>
      ))}

      {/* Preview Dialog */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-2xl w-[350px] max-w-lg shadow-2xl relative font-poppins">
            <button
              className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
              onClick={() => setPreview(null)}
            >
              <X size={22} />
            </button>
            <Dialog.Title className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2 ">
              <Eye size={22} /> Document Preview
            </Dialog.Title>
            {preview && (
              <div className="space-y-6">
                <div>   
                <p className="text-sm font-medium text-green-500 mb-2 ">Front Image →</p>
                  <div className="bg-white-100 p-2 rounded-md border border-gray-300 ">
                    <img
                      src={`${BASE_IMAGE_URL}/${preview.frontImage}`}
                      alt="Front"
                      className="max-w-full max-h-[250px] mx-auto rounded shadow object-contain shadow-lg hover:shadow-xl cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-500 mb-2 ">Back Image →</p>
                  <div className="bg-white-100 p-2 rounded-md border border-gray-300 shadow-lg hover:shadow-xl cursor-pointer">
                    <img
                      src={`${BASE_IMAGE_URL}/${preview.frontImage}`}
                      alt="Back"
                      className="max-w-full max-h-[250px] mx-auto rounded shadow object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Approve/Reject Dialog */}
      <Dialog open={statusDialog.show} onClose={() => setStatusDialog({ show: false })} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 font-poppins ">
          <Dialog.Panel className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setStatusDialog({ show: false })}
            >
              <X size={20} />
            </button>
            <Dialog.Title className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <WarningCircle size={20} className="text-yellow-500" />
              Confirm Action
            </Dialog.Title>
            <p className="text-sm text-gray-600">
              Are you sure you want to <strong>{statusDialog.status?.toLowerCase()}</strong> this KYC?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setStatusDialog({ show: false })}
                className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className={`px-4 py-2 text-sm rounded text-white ${
                  statusDialog.status === "APPROVED"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default KycCardView;
