// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// const MenuContext = createContext();

// export const MenuProvider = ({ children }) => {
//   const [menu, setMenu] = useState([]);

//   const fetchMenu = async () => {
//     const res = await axios.get("http://localhost:5000/api/menu");
//     setMenu(res.data);
//   };

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   return (
//     <MenuContext.Provider value={{ menu, setMenu, fetchMenu }}>
//       {children}
//     </MenuContext.Provider>
//   );
// };

// export const useMenu = () => useContext(MenuContext);


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
