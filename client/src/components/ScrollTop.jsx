import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll back to top"
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary-500 text-white shadow-card flex items-center justify-center hover:bg-primary-600 hover:-translate-y-1 transition-all"
    >
      <FiArrowUp size={18} />
    </button>
  );
}
