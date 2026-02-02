import { NavLink } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag } from "lucide-react";

const linkBase =
  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition";
const inactive = "text-gray-700 hover:bg-gray-100";
const active = "bg-black text-white";

export default function Navbar() {
  return (
    <aside className="w-64 min-h-screen border-r bg-white p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Eatoes Admin</h1>
        <p className="text-xs text-gray-500">Restaurant Dashboard</p>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
          end
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/menu"
          className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
        >
          <UtensilsCrossed size={18} />
          Menu
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
        >
          <ShoppingBag size={18} />
          Orders
        </NavLink>
      </nav>
    </aside>
  );
}
