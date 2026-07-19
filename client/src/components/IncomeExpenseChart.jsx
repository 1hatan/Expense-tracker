import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { formatCurrency } from "../utils/formatCurrency.js";

export default function IncomeExpenseChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-slate-500 text-center py-16">No data yet for this period.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-500" />
        <YAxis tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-500" />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "1px solid #e4e8f0", fontSize: 13 }}
          formatter={(value) => formatCurrency(value)}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="income" name="Income" fill="#17b3a3" radius={[6, 6, 0, 0]} />
        <Bar dataKey="expense" name="Expense" fill="#e0616b" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
