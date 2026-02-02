import { useEffect, useState } from "react";
import api from "../api";

const extractArray = (res) => {
  const d = res?.data;
  return Array.isArray(d) ? d : d?.data ?? [];
};

export default function Orders() {
  const [orders, setOrders] = useState([]);   // ✅ always array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ because baseURL already has /api
      const res = await api.get("/orders");

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

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Orders</h2>

      {orders.length === 0 ? (
        <p className="mt-4 text-gray-500">No orders found.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="rounded-xl border bg-white p-4">
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold">
                    Order #{String(o._id).slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {o.customerName || o.name || "Customer"}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium">{o.status || "Pending"}</p>
                </div>
              </div>

              {/* items safe */}
              {Array.isArray(o.items) && o.items.length > 0 && (
                <div className="mt-3 text-sm text-gray-700">
                  <p className="font-medium">Items:</p>
                  <ul className="list-disc pl-5">
                    {o.items.map((it, idx) => (
                      <li key={idx}>
                        {it.name || it.itemName || "Item"} × {it.qty || it.quantity || 1}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-gray-500">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                </span>
                <span className="font-semibold">
                  ₹{o.total ?? o.totalAmount ?? 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
