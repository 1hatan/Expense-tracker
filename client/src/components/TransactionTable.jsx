import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { formatCurrency, formatDate } from "../utils/formatCurrency.js";
import { CATEGORY_COLORS } from "../utils/categories.js";

/**
 * `type` is "expense" or "income" — controls which columns render.
 */
export default function TransactionTable({ type, rows, loading, onEdit, onDelete }) {
  if (loading) {
    return <div className="card p-10 text-center text-slate-500 text-sm">Loading transactions...</div>;
  }

  if (!rows || rows.length === 0) {
    return <div className="card p-10 text-center text-slate-500 text-sm">No records found. Try adjusting your filters.</div>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
            <th className="px-4 py-3 font-medium">{type === "expense" ? "Title" : "Source"}</th>
            {type === "expense" && <th className="px-4 py-3 font-medium">Category</th>}
            <th className="px-4 py-3 font-medium">Date</th>
            {type === "expense" && <th className="px-4 py-3 font-medium">Payment</th>}
            <th className="px-4 py-3 font-medium text-right">Amount</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3 font-medium">{type === "expense" ? row.title : row.source}</td>
              {type === "expense" && (
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${CATEGORY_COLORS[row.category]}22`, color: CATEGORY_COLORS[row.category] }}
                  >
                    {row.category}
                  </span>
                </td>
              )}
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(row.date)}</td>
              {type === "expense" && <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.paymentMethod}</td>}
              <td className={`px-4 py-3 text-right font-semibold ${type === "expense" ? "text-expense" : "text-income"}`}>
                {type === "expense" ? "-" : "+"}
                {formatCurrency(row.amount)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(row)}
                    aria-label="Edit"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    aria-label="Delete"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-expense hover:bg-expense/10"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
