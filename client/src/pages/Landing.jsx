import { Link } from "react-router-dom";
import { FiTrendingUp, FiPieChart, FiShield, FiSmartphone } from "react-icons/fi";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const FEATURES = [
  { icon: FiTrendingUp, title: "Track everything", desc: "Log income and expenses in seconds, organized by category and payment method." },
  { icon: FiPieChart, title: "See the patterns", desc: "Interactive charts break down where your money goes, month over month." },
  { icon: FiShield, title: "Secure by default", desc: "JWT authentication and hashed passwords keep your financial data protected." },
  { icon: FiSmartphone, title: "Works everywhere", desc: "A responsive layout that's just as comfortable on your phone as your desktop." },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <p className="inline-flex items-center gap-2 font-mono text-xs text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-4 py-1.5 rounded-full mb-6">
            &lt;PersonalFinance /&gt;
          </p>
          <h1 className="text-4xl sm:text-5xl font-display font-bold max-w-2xl mx-auto leading-tight mb-5">
            Know exactly where your money goes.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-10">
            A simple, fast expense tracker with clear reports, category breakdowns, and everything
            you need to build better money habits.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="btn-primary px-7 py-3">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-outline px-7 py-3">
              Log In
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6">
                <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-500 flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
