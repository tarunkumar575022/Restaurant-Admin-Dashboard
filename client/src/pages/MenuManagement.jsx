import { useEffect, useState } from "react";
import axios from "axios";
import MenuCard from "../components/MenuCard";
import useDebounce from "../hooks/useDebounce";

const emptyForm = { name: "", category: "Appetizer", price: "" };

export default function MenuManagement() {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 400);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch menu (supports search query)
  const fetchMenu = async (q = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/menu?q=${encodeURIComponent(q)}`);
      setMenu(res.data || []);
    } catch (err) {
      console.error("Fetch menu failed:", err);
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch
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

    if (!payload.name || !payload.category || !payload.price) return;

    try {
      if (editingId) {
        await axios.put(`/api/menu/${editingId}`, payload);
      } else {
        await axios.post(`/api/menu`, payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchMenu(debounced);
    } catch (err) {
      console.error("Save failed:", err);
      alert(err?.response?.data?.message || "Failed to save menu item");
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

  // ✅ Delete item
  const onDelete = async (id) => {
    const ok = window.confirm("Delete this menu item?");
    if (!ok) return;

    try {
      await axios.delete(`/api/menu/${id}`);
      fetchMenu(debounced);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err?.response?.data?.message || "Failed to delete");
    }
  };

  // ✅ Optimistic Availability Toggle
  const onToggle = async (id, currentStatus) => {
    const prev = menu; // snapshot for rollback

    // Optimistic UI update
    setMenu((m) =>
      m.map((it) =>
        it._id === id ? { ...it, isAvailable: !currentStatus } : it
      )
    );

    try {
      await axios.patch(`/api/menu/${id}/availability`);
    } catch (err) {
      console.error("Toggle failed:", err);
      // rollback
      setMenu(prev);
      alert("Failed to update availability. Reverted changes.");
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

              <button className="w-full rounded-xl bg-black text-white py-2 font-medium hover:opacity-90">
                {editingId ? "Update Item" : "Create Item"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="w-full rounded-xl border py-2 font-medium"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
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

          {!loading && (
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
