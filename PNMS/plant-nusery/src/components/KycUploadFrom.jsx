import React, { useState, useEffect } from 'react';
import { uploadKyc, getMyKyc } from '../services/kycService';
import { toast } from 'sonner';
import {
  FileArrowUp,
  IdentificationBadge,
  IdentificationCard,
  CreditCard,
  AirplaneTilt,
  CaretDown,
  Hourglass,
  CheckCircle,
  XCircle,
  Question,
} from '@phosphor-icons/react';

const documentOptions = [
  { value: 'AADHAR', label: 'Aadhar Card', icon: <IdentificationCard size={18} /> },
  { value: 'PAN', label: 'PAN Card', icon: <CreditCard size={18} /> },
  { value: 'PASSPORT', label: 'Passport', icon: <AirplaneTilt size={18} /> },
];

const KycUploadForm = () => {
  const [documentType, setDocumentType] = useState('AADHAR');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [confirmValid, setConfirmValid] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await getMyKyc();
      setStatus(res.status);
      setDisabled(true); // disable form if already uploaded
    } catch (err) {
      console.warn("No KYC found or failed to fetch.");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!frontImage || !backImage || !confirmValid) {
      toast.error("✅ Confirm validity and upload both images.");
      return;
    }

    setIsLoading(true);
    try {
      await uploadKyc(documentType, frontImage, backImage);
      toast.success("KYC submitted successfully!");
      fetchStatus();
    } catch (error) {
      toast.error("❌ Upload failed or duplicate KYC.");
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBadge = () => {
    const base = "inline-flex items-center gap-2 px-3 py-1 rounded-full shadow-sm text-sm font-medium transition duration-200 cursor-pointer hover:shadow-lg";
    switch (status) {
      case 'APPROVED':
        return <span className={`${base} bg-green-100 text-green-700`}><CheckCircle size={16} /> Approved</span>;
      case 'REJECTED':
        return <span className={`${base} bg-red-100 text-red-600`}><XCircle size={16} /> Rejected</span>;
      case 'PENDING':
        return <span className={`${base} bg-yellow-100 text-yellow-700`}><Hourglass size={16} /> Pending</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-600`}><Question size={16} /> Not Submitted</span>;
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 md:px-20 font-poppins">
      <div className="max-w-3xl mx-auto shadow-xl rounded-2xl p-8 bg-white hover:shadow-2xl transition cursor-pointer">
        <h2 className="text-2xl font-semibold text-green-500 mb-6 flex items-center gap-2">
          <IdentificationBadge size={26} /> KYC Upload
        </h2>

        {/* Inline Status */}
        <div className="mb-6 flex items-center gap-3 text-base text-gray-700 font-medium">
          <span>Your current KYC status:</span>
          {renderBadge()}
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Document Type */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Document Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                disabled={disabled}
                className="block w-full bg-white border border-gray-300 rounded-xl px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700 cursor-pointer hover:border-green-500 transition"
              >
                {documentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <CaretDown size={18} className="text-gray-500" />
              </div>
            </div>
            {/* Icon Preview */}
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              {documentOptions.find(opt => opt.value === documentType)?.icon}
              <span>{documentOptions.find(opt => opt.value === documentType)?.label}</span>
            </div>
          </div>

          {/* File Upload */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Front Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFrontImage(e.target.files[0])}
                required
                disabled={disabled}
                className="w-full border rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-full file:bg-green-50 file:text-green-600 hover:file:bg-green-100 transition cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Back Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBackImage(e.target.files[0])}
                required
                disabled={disabled}
                className="w-full border rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-full file:bg-green-50 file:text-green-600 hover:file:bg-green-100 transition cursor-pointer"
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={confirmValid}
              onChange={(e) => setConfirmValid(e.target.checked)}
              className="mt-1 cursor-pointer"
              disabled={disabled}
              required
            />
            <label className="text-sm text-gray-600 cursor-pointer">
              I confirm that the documents are valid and belong to me.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || disabled}
            className="bg-green-500 text-white py-2 px-6 rounded-xl hover:bg-green-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <FileArrowUp size={20} />
            {isLoading ? "Uploading..." : "Submit KYC"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KycUploadForm;
