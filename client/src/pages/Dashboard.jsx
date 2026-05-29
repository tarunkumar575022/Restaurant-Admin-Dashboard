import { useEffect, useMemo, useState } from "react";
import api from "../api";

const extractArray = (res) => {
  const d = res?.data;
  return Array.isArray(d) ? d : d?.data ?? [];
};

const normalizeStatus = (s) => String(s || "").trim().toLowerCase();

const STATUSES = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];

export default function Dashboard() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiInsights, setAiInsights] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [menuRes, ordersRes] = await Promise.all([
        api.get("/menu"),
        api.get("/orders"),
      ]);

      setMenu(extractArray(menuRes));
      setOrders(extractArray(ordersRes));
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      setMenu([]);
      setOrders([]);
      setError(err?.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAIInsights = async () => {
    try {
      setLoadingInsights(true);
      const res = await api.get("/analytics/ai-insights");
      setAiInsights(res.data.insights);
    } catch (err) {
      console.error("AI Insights fetch failed:", err);
      alert(err?.response?.data?.message || "Failed to load AI Insights");
    } finally {
      setLoadingInsights(false);
    }
  };

  // ✅ counts
  const totalMenuItems = menu.length;

  const availableItems = useMemo(() => {
    // if your schema uses isAvailable boolean:
    return menu.filter((m) => m.isAvailable !== false).length;
  }, [menu]);

  const unavailableItems = totalMenuItems - availableItems;

  const orderStatusCounts = useMemo(() => {
    const counts = {};
    STATUSES.forEach((s) => (counts[s] = 0));

    for (const o of orders) {
      const st = normalizeStatus(o.status);
      if (st === "pending") counts.Pending++;
      else if (st === "preparing") counts.Preparing++;
      else if (st === "ready") counts.Ready++;
      else if (st === "delivered") counts.Delivered++;
      else if (st === "cancelled" || st === "canceled") counts.Cancelled++;
      else counts.Pending++; // default
    }
    return counts;
  }, [orders]);

  const pendingOrders = orderStatusCounts.Pending;

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-4 text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-white p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-gray-500">
            Live counts from Menu & Orders.
          </p>
        </div>

        <button
          onClick={fetchAll}
          className="rounded-xl border px-4 py-2 font-medium hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Menu Items</p>
          <p className="text-3xl font-bold mt-2">{totalMenuItems}</p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Available Items</p>
          <p className="text-3xl font-bold mt-2">{availableItems}</p>
          <p className="text-xs text-gray-400 mt-2">
            Unavailable: {unavailableItems}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending Orders</p>
          <p className="text-3xl font-bold mt-2">{pendingOrders}</p>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
            <span>🤖</span> AI Business Insights
          </h3>
          <button
            onClick={fetchAIInsights}
            disabled={loadingInsights}
            className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loadingInsights ? "Analyzing..." : "Generate Insights"}
          </button>
        </div>
        
        {aiInsights ? (
          <div className="space-y-2 text-indigo-800 text-sm bg-white/60 p-4 rounded-lg">
            {aiInsights.split('\n').filter(line => line.trim()).map((line, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>{line.replace(/^-\s*|^\*\s*/, '')}</span>
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-indigo-600/70 italic bg-white/40 p-4 rounded-lg">
            Click generate to let AI analyze your recent order patterns, top sellers, and revenue...
          </p>
        )}
      </div>

      {/* Optional: Order status breakdown */}
      <div className="rounded-xl border bg-white p-4 shadow-sm mt-6">
        <h3 className="font-semibold mb-3">Orders by Status</h3>

        <div className="grid sm:grid-cols-5 gap-3">
          {STATUSES.map((s) => (
            <div key={s} className="rounded-lg border p-3">
              <p className="text-xs text-gray-500">{s}</p>
              <p className="text-xl font-bold mt-1">{orderStatusCounts[s]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
