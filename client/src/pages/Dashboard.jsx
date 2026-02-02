import { useEffect, useState } from "react";
import axios from "axios";

function unwrapArray(responseData) {
  // Supports both:
  // 1) [ ... ]  (array)
  // 2) { success: true, data: [ ... ] }  (wrapped)
  if (Array.isArray(responseData)) return responseData;
  if (responseData && Array.isArray(responseData.data)) return responseData.data;
  return [];
}

export default function Dashboard() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [menuRes, ordersRes] = await Promise.all([
          axios.get("/menu"),
          axios.get("/orders"),
        ]);

        const menuArr = unwrapArray(menuRes.data);
        const ordersArr = unwrapArray(ordersRes.data);

        // Debug (optional): see actual response shapes
        console.log("MENU RESPONSE:", menuRes.data);
        console.log("ORDERS RESPONSE:", ordersRes.data);

        setMenu(menuArr);
        setOrders(ordersArr);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setMenu([]);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalMenuItems = menu.length;
  const availableItems = menu.filter((m) => m.isAvailable).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  if (loading) return <div className="text-gray-600">Loading dashboard...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Total Menu Items" value={totalMenuItems} />
        <StatCard title="Available Items" value={availableItems} />
        <StatCard title="Pending Orders" value={pendingOrders} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
