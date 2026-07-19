import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import SearchFilterBar from "../components/SearchFilterBar.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import Pagination from "../components/Pagination.jsx";
import IncomeFormModal from "../components/IncomeFormModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import useDebounce from "../hooks/useDebounce.js";
import { exportToCSV } from "../utils/exportCSV.js";

export default function Income() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchIncome = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/income", {
        params: { search: debouncedSearch, startDate, endDate, sortBy, order, page, limit: 10 },
      });
      setRows(data.data);
      setPages(data.pages);
    } catch {
      toast.error("Could not load income");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, startDate, endDate, sortBy, order, page]);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, startDate, endDate, sortBy, order]);

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (row) => {
    setEditing(row);
    setFormOpen(true);
  };

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/income/${editing._id}`, form);
        toast.success("Income updated");
      } else {
        await api.post("/income", form);
        toast.success("Income added");
      }
      setFormOpen(false);
      fetchIncome();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/income/${deleteTarget._id}`);
      toast.success("Income deleted");
      setDeleteTarget(null);
      fetchIncome();
    } catch {
      toast.error("Could not delete income");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    if (rows.length === 0) return toast.error("Nothing to export");
    exportToCSV(
      rows.map((r) => ({
        Source: r.source,
        Amount: r.amount,
        Date: new Date(r.date).toISOString().slice(0, 10),
        Notes: r.notes,
      })),
      "income.csv"
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-display font-bold">Income</h2>
        <div className="flex gap-2">
          <button className="btn-outline" onClick={handleExport}>
            <FiDownload size={16} /> Export CSV
          </button>
          <button className="btn-primary" onClick={handleAdd}>
            <FiPlus size={16} /> Add Income
          </button>
        </div>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        order={order}
        onOrderChange={setOrder}
      />

      <TransactionTable type="income" rows={rows} loading={loading} onEdit={handleEdit} onDelete={setDeleteTarget} />

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      <IncomeFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editing}
        saving={saving}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${deleteTarget?.source}"? This can't be undone.`}
      />
    </div>
  );
}
