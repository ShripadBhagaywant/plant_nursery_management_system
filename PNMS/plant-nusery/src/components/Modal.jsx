import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4 cursor-pointer">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-7 text-gray-500 hover:text-red-500 text-3xl font-bold z-10"
          aria-label="Close Modal"
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
