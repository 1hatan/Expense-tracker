export default function DashboardCard({ label, value, icon: Icon, tone = "primary" }) {
  const toneClasses = {
    primary: "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400",
    income: "bg-income/10 text-income",
    expense: "bg-expense/10 text-expense",
    accent: "bg-accent-400/10 text-accent-500",
  };

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-xl font-display font-bold truncate">{value}</p>
      </div>
    </div>
  );
}
