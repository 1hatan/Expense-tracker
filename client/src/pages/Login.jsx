import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required.";
    if (!form.password) errs.password = "Password is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login(form.email, form.password, rememberMe);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-display font-bold text-xl mb-8">
          <span className="text-primary-500">Expense</span>Tracker
        </Link>

        <div className="card p-7">
          <h1 className="text-xl font-display font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Log in to continue tracking your finances.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" name="email" type="email" className="input" value={form.email} onChange={handleChange} />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input id="password" name="password" type="password" className="input" value={form.password} onChange={handleChange} />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded" />
              Remember me
            </label>

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-xs text-center text-slate-400 mt-6 font-mono">
          Demo: demo@example.com / demo1234 (after running the seed script)
        </p>
      </div>
    </div>
  );
}
