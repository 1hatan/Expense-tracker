import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { formatCurrency } from "../utils/formatCurrency.js";

export default function TrendLineChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-slate-500 text-center py-16">No data yet for this period.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-500" />
        <YAxis tick={{ fontSize: 12 }} stroke="currentColor" className="text-slate-500" />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "1px solid #e4e8f0", fontSize: 13 }}
          formatter={(value) => formatCurrency(value)}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="income" name="Income" stroke="#17b3a3" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="expense" name="Expense" stroke="#e0616b" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
