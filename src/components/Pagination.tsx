import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + showMax - 1);

      if (end === totalPages) {
        start = Math.max(1, end - showMax + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={clsx(
          "p-2 rounded-lg border border-borderColor transition-all duration-200",
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-primary-300 hover:bg-gray-100"
        )}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-1">
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium text-primary-300 hover:bg-gray-100 transition-all duration-200"
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-1 text-gray-400">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={clsx(
              "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200",
              currentPage === page
                ? "bg-global-green text-white shadow-md shadow-green-200"
                : "text-primary-300 hover:bg-gray-100"
            )}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-1 text-gray-400">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium text-primary-300 hover:bg-gray-100 transition-all duration-200"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={clsx(
          "p-2 rounded-lg border border-borderColor transition-all duration-200",
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-primary-300 hover:bg-gray-100"
        )}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
