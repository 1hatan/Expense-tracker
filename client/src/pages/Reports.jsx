import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import CategoryPieChart from "../components/CategoryPieChart.jsx";
import TrendLineChart from "../components/TrendLineChart.jsx";
import Loader from "../components/Loader.jsx";
import { formatCurrency, formatDate } from "../utils/formatCurrency.js";
import { exportToCSV, exportToPDF } from "../utils/exportCSV.js";

const PERIODS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function Reports() {
  const [period, setPeriod] = useState("monthly");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      try {
        const { data } = await api.get("/reports", { params: { period } });
        setReport(data.data);
      } catch {
        toast.error("Could not load report");
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [period]);

  // Build a simple day-by-day trend series from the raw transactions
  // returned for the selected period.
  const trendSeries = useMemo(() => {
    if (!report) return [];
    const map = new Map();

    report.incomes.forEach((i) => {
      const key = new Date(i.date).toISOString().slice(0, 10);
      const entry = map.get(key) || { label: key, income: 0, expense: 0 };
      entry.income += i.amount;
      map.set(key, entry);
    });

    report.expenses.forEach((e) => {
      const key = new Date(e.date).toISOString().slice(0, 10);
      const entry = map.get(key) || { label: key, income: 0, expense: 0 };
      entry.expense += e.amount;
      map.set(key, entry);
    });

    return Array.from(map.values()).sort((a, b) => (a.label > b.label ? 1 : -1));
  }, [report]);

  const combinedRows = useMemo(() => {
    if (!report) return [];
    return [
      ...report.expenses.map((e) => ({ type: "Expense", label: e.title, category: e.category, amount: e.amount, date: e.date })),
      ...report.incomes.map((i) => ({ type: "Income", label: i.source, category: "-", amount: i.amount, date: i.date })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [report]);

  const handleExportCSV = () => {
    if (combinedRows.length === 0) return toast.error("Nothing to export");
    exportToCSV(
      combinedRows.map((r) => ({
        Type: r.type,
        Description: r.label,
        Category: r.category,
        Amount: r.amount,
        Date: new Date(r.date).toISOString().slice(0, 10),
      })),
      `report-${period}.csv`
    );
  };

  const handleExportPDF = () => {
    if (combinedRows.length === 0) return toast.error("Nothing to export");
    exportToPDF(
      `${period.charAt(0).toUpperCase() + period.slice(1)} Report`,
      combinedRows.map((r) => ({ ...r, date: formatDate(r.date), amount: formatCurrency(r.amount) })),
      [
        { key: "type", label: "Type" },
        { key: "label", label: "Description" },
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount" },
        { key: "date", label: "Date" },
      ]
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-display font-bold">Reports</h2>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={handleExportCSV}>
            <FiDownload size={16} /> CSV
          </button>
          <button className="btn-outline" onClick={handleExportPDF}>
            <FiFileText size={16} /> PDF
          </button>
        </div>
      </div>

      <div className="card p-1.5 inline-flex gap-1">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === p.value ? "bg-primary-500 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Total Income</p>
              <p className="text-2xl font-display font-bold text-income">{formatCurrency(report?.totalIncome)}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Total Expense</p>
              <p className="text-2xl font-display font-bold text-expense">{formatCurrency(report?.totalExpense)}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="card p-5">
              <h3 className="font-semibold mb-4">Trend</h3>
              <TrendLineChart data={trendSeries} />
            </div>
            <div className="card p-5">
              <h3 className="font-semibold mb-4">Expense by Category</h3>
              <CategoryPieChart data={report?.categoryBreakdown} />
            </div>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-slate-500 dark:text-slate-400">
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {combinedRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No transactions in this period.
                    </td>
                  </tr>
                ) : (
                  combinedRows.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                      <td className="px-4 py-3">{r.type}</td>
                      <td className="px-4 py-3 font-medium">{r.label}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{r.category}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(r.date)}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${r.type === "Income" ? "text-income" : "text-expense"}`}>
                        {r.type === "Income" ? "+" : "-"}
                        {formatCurrency(r.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
