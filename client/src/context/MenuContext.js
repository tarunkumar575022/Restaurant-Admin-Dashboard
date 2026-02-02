import { createContext, useContext, useEffect, useState } from "react";
import api from "../api"; // ✅ IMPORTANT: use your configured api instance

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState([]);      // ✅ always array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/menu");

      // ✅ Handle both response shapes safely
      const items = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setMenu(items);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
      setMenu([]); // ✅ prevent crash
      setError(err.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch menu on app load
  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <MenuContext.Provider
      value={{
        menu,
        loading,
        error,
        fetchMenu, // 👈 reusable after create/delete
        setMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("useMenuContext must be used inside MenuProvider");
  }
  return ctx;
}
