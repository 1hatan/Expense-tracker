export function formatCurrency(amount, currency = "INR") {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(value);
  } catch {
    return `₹${value.toFixed(2)}`;
  }
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
