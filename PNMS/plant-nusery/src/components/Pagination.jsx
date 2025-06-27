import { CaretLeft, CaretRight } from "@phosphor-icons/react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center gap-4 font-poppins">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center px-3 py-1 border rounded-lg bg-green-200 hover:bg-gray-100 disabled:opacity-50"
      >
        <CaretLeft size={18} />
        <span className="ml-1"></span>
      </button>

      <span className="text-sm text-gray-700">
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center px-3 py-1 border rounded-lg bg-green-200 hover:bg-gray-100 disabled:opacity-50"
      >
        <span className="mr-1"></span>
        <CaretRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
