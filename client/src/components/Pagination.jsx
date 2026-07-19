import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center disabled:opacity-40 hover:border-primary-500"
        aria-label="Previous page"
      >
        <FiChevronLeft size={16} />
      </button>

      {pageNumbers.map((n, i) => {
        const prev = pageNumbers[i - 1];
        const showEllipsis = prev && n - prev > 1;
        return (
          <span key={n} className="flex items-center gap-1.5">
            {showEllipsis && <span className="px-1 text-slate-400">…</span>}
            <button
              onClick={() => onPageChange(n)}
              className={`w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                n === page
                  ? "bg-primary-500 text-white"
                  : "border border-slate-300 dark:border-slate-700 hover:border-primary-500"
              }`}
            >
              {n}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center disabled:opacity-40 hover:border-primary-500"
        aria-label="Next page"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}
