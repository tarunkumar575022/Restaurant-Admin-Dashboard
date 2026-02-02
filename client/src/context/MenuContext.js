import { createContext, useContext, useState } from "react";

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState([]);

  return (
    <MenuContext.Provider value={{ menu, setMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenuContext must be used inside MenuProvider");
  return ctx;
}
