import { useEffect, useState } from "react";
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPocket } from "react-icons/fi";
import api from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";
import DashboardCard from "../components/DashboardCard.jsx";
import IncomeExpenseChart from "../components/IncomeExpenseChart.jsx";
import CategoryPieChart from "../components/CategoryPieChart.jsx";
import Loader from "../components/Loader.jsx";
import { formatCurrency, formatDate } from "../utils/formatCurrency.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const { data } = await api.get("/reports/dashboard");
        setSummary(data.data);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Hi {user?.name?.split(" ")[0]}, here&apos;s your overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">A quick look at your finances.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard label="Total Balance" value={formatCurrency(summary?.totalBalance)} icon={FiDollarSign} tone="primary" />
        <DashboardCard label="Total Income" value={formatCurrency(summary?.totalIncome)} icon={FiTrendingUp} tone="income" />
        <DashboardCard label="Total Expense" value={formatCurrency(summary?.totalExpense)} icon={FiTrendingDown} tone="expense" />
        <DashboardCard label="Monthly Savings" value={formatCurrency(summary?.monthlySavings)} icon={FiPocket} tone="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Income vs Expense (last 6 months)</h3>
          <IncomeExpenseChart data={summary?.monthlySeries} />
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Expense by Category</h3>
          <CategoryPieChart data={summary?.categoryBreakdown} />
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4">Recent Transactions</h3>
        {summary?.recentTransactions?.length ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {summary.recentTransactions.map((t) => (
              <li key={`${t.type}-${t._id}`} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm">{t.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(t.date)}</p>
                </div>
                <span className={`font-semibold text-sm ${t.type === "income" ? "text-income" : "text-expense"}`}>
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 py-6 text-center">No transactions yet — add your first income or expense.</p>
        )}
      </div>
    </div>
  );
}
