export default function Loader({ fullScreen = false }) {
  const wrapperClass = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-950"
    : "flex items-center justify-center py-16";

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 animate-spin" />
        <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">Loading...</span>
      </div>
    </div>
  );
}
