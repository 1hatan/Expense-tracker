import { useEffect, useState } from "react";
import Modal from "./Modal.jsx";

const EMPTY_FORM = {
  source: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function IncomeFormModal({ open, onClose, onSubmit, initialData, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? { ...initialData, date: new Date(initialData.date).toISOString().slice(0, 10) }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.source.trim()) errs.source = "Source is required.";
    if (!form.amount || Number(form.amount) <= 0) errs.amount = "Enter an amount greater than 0.";
    if (!form.date) errs.date = "Select a date.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Edit Income" : "Add Income"}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="source">
            Source
          </label>
          <input id="source" name="source" className="input" value={form.source} onChange={handleChange} placeholder="e.g. Salary, Freelance" />
          {errors.source && <p className="error-text">{errors.source}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="amount">
              Amount
            </label>
            <input id="amount" name="amount" type="number" step="0.01" className="input" value={form.amount} onChange={handleChange} />
            {errors.amount && <p className="error-text">{errors.amount}</p>}
          </div>
          <div>
            <label className="label" htmlFor="date">
              Date
            </label>
            <input id="date" name="date" type="date" className="input" value={form.date} onChange={handleChange} />
            {errors.date && <p className="error-text">{errors.date}</p>}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea id="notes" name="notes" rows="3" className="input resize-none" value={form.notes} onChange={handleChange} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : initialData ? "Save Changes" : "Add Income"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
