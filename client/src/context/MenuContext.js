import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/menu");

      // supports both: [] OR {success:true, data:[]}
      const items = Array.isArray(res.data) ? res.data : res.data?.data ?? [];

      setMenu(items);
    } catch (err) {
      console.error(err);
      setMenu([]);
      setError(err.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <MenuContext.Provider value={{ menu, loading, error, fetchMenu, setMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenuContext must be used inside MenuProvider");
  return ctx;
}
