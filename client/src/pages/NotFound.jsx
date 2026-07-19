import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-slate-50 dark:bg-slate-950">
      <p className="font-mono text-primary-500 text-sm mb-3">Error 404</p>
      <h1 className="text-4xl font-display font-bold mb-3">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
