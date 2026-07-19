import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { CATEGORY_COLORS } from "../utils/categories.js";
import { formatCurrency } from "../utils/formatCurrency.js";

export default function CategoryPieChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-slate-500 text-center py-16">No expenses to break down yet.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={100} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || "#9aa3b2"} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 10, border: "1px solid #e4e8f0", fontSize: 13 }}
          formatter={(value) => formatCurrency(value)}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
