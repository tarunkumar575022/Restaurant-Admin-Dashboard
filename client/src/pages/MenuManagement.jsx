import { useEffect, useState } from "react";
import api from "../api";
import MenuCard from "../components/MenuCard";
import useDebounce from "../hooks/useDebounce";

const emptyForm = { name: "", category: "Appetizer", price: "" };

// ✅ supports both [] and { success:true, data:[] }
const extractArray = (res) => {
  const d = res?.data;
  return Array.isArray(d) ? d : d?.data ?? [];
};

export default function MenuManagement() {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 400);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch menu with optional search query
  const fetchMenu = async (q = "") => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/menu", {
        params: q && q.trim() ? { q: q.trim() } : {},
      });

      setMenu(extractArray(res));
    } catch (err) {
      console.error("Fetch menu failed:", err);
      setMenu([]);
      setError(err?.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search fetch
  useEffect(() => {
    fetchMenu(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // ✅ Create / Update
  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
    };

    // basic validation
    if (!payload.name) return alert("Name is required");
    if (!payload.category) return alert("Category is required");
    if (!payload.price || Number.isNaN(payload.price) || payload.price <= 0)
      return alert("Enter a valid price");

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/menu/${editingId}`, payload);
      } else {
        await api.post(`/menu`, payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      await fetchMenu(debounced);
    } catch (err) {
      console.error("Save failed:", err);
      alert(err?.response?.data?.message || "Failed to save menu item");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Start editing
  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      category: item.category || "Appetizer",
      price: String(item.price ?? ""),
    });
  };

  // ✅ Cancel edit
  const onCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // ✅ Delete item
  const onDelete = async (id) => {
    const ok = window.confirm("Delete this menu item?");
    if (!ok) return;

    try {
      await api.delete(`/menu/${id}`);
      await fetchMenu(debounced);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.response?.data?.message || "Failed to delete");
    }
  };

  // ✅ Optimistic Availability Toggle with safe rollback
  const onToggle = async (id, currentStatus) => {
    const prev = [...menu]; // ✅ safe snapshot

    // Optimistic UI update
    setMenu((m) =>
      m.map((it) =>
        it._id === id ? { ...it, isAvailable: !currentStatus } : it
      )
    );

    try {
      await api.patch(`/menu/${id}/availability`);
    } catch (err) {
      console.error("Toggle failed:", err);
      setMenu(prev); // rollback
      alert(err?.response?.data?.message || "Failed to update availability");
    }
  };

  const title = editingId ? "Edit Menu Item" : "Add Menu Item";

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <p className="text-sm text-gray-500">
            Create, edit, delete items and toggle availability.
          </p>
        </div>

        {/* Search */}
        <input
          className="w-full sm:w-72 rounded-xl border px-3 py-2"
          placeholder="Search menu (debounced)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="font-semibold mb-3">{title}</h3>

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Category</label>
                <select
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option>Appetizer</option>
                  <option>Main Course</option>
                  <option>Dessert</option>
                  <option>Beverage</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Price (₹)</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <button
                disabled={saving}
                className="w-full rounded-xl bg-black text-white py-2 font-medium hover:opacity-90 disabled:opacity-60"
              >
                {saving
                  ? editingId
                    ? "Updating..."
                    : "Creating..."
                  : editingId
                  ? "Update Item"
                  : "Create Item"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="w-full rounded-xl border py-2 font-medium"
                  onClick={onCancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          {loading && (
            <div className="rounded-xl border bg-white p-4 text-gray-600">
              Loading menu...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border bg-white p-4 text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                {menu.map((item) => (
                  <MenuCard
                    key={item._id}
                    item={item}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>

              {menu.length === 0 && (
                <div className="mt-6 text-center text-gray-500">
                  No items found. Add your first menu item.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
