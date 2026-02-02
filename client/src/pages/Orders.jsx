import { useEffect, useState } from "react";
import axios from "axios";
import OrderRow from "../components/OrderRow";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/api/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Fetch orders failed:", err);
      setError(err?.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onStatusChange = async (id, status) => {
    try {
      // Optimistic UI (optional)
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );

      await axios.patch(`/api/orders/${id}/status`, { status });
      // If you prefer strict sync with DB, uncomment:
      // fetchOrders();
    } catch (err) {
      console.error("Update status failed:", err);
      alert(err?.response?.data?.message || "Failed to update order status");
      // rollback by refetch
      fetchOrders();
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-sm text-gray-500">
            View incoming orders and update order status.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="rounded-xl border bg-white p-4 text-gray-600">
          Loading orders...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border bg-white p-4 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3 text-sm font-semibold">Customer</th>
                <th className="p-3 text-sm font-semibold">Items</th>
                <th className="p-3 text-sm font-semibold">Total</th>
                <th className="p-3 text-sm font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onStatusChange={onStatusChange}
                />
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="p-6 text-center text-gray-500">No orders yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
