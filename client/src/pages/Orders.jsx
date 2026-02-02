import { useEffect, useState } from "react";
import api from "../api";

const STATUSES = ["pending", "preparing", "ready", "delivered", "cancelled"];

const extractArray = (res) => {
  const d = res?.data;
  return Array.isArray(d) ? d : d?.data ?? [];
};

const pretty = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/orders"); // ✅ baseURL already includes /api
      setOrders(extractArray(res));
    } catch (err) {
      console.error("Fetch orders failed:", err);
      setOrders([]);
      setError(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const changeStatus = async (orderId, newStatus) => {
    const prev = [...orders];

    // ✅ optimistic UI
    setOrders((p) =>
      p.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      // ✅ backend expects req.body.status
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
    } catch (err) {
      console.error("Update status failed:", err);
      setOrders(prev);
      alert(err?.response?.data?.message || "Failed to update order status");
    }
  };

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-sm text-gray-500">Update order status easily.</p>
        </div>

        <button
          onClick={fetchOrders}
          className="rounded-xl border px-4 py-2 font-medium hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold">
                    Order #{String(o._id).slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {o.customerName || "Customer"}
                  </p>
                </div>

                {/* ✅ Status dropdown */}
                <div className="text-right">
                  <p className="text-xs text-gray-500">Status</p>
                  <select
                    className="mt-1 rounded-lg border px-3 py-1 text-sm"
                    value={o.status || "pending"}
                    onChange={(e) => changeStatus(o._id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {pretty(s)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ✅ Items (populate items.menuItem) */}
              <div className="mt-3 text-sm text-gray-700">
                <p className="font-medium">Items:</p>
                {Array.isArray(o.items) && o.items.length > 0 ? (
                  <ul className="list-disc pl-5 mt-1">
                    {o.items.map((it, idx) => (
                      <li key={idx}>
                        {it.menuItem?.name || "Item"} × {it.quantity || 1}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 mt-1">No items</p>
                )}
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                </span>
                <span className="font-semibold">₹{o.totalAmount ?? 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
