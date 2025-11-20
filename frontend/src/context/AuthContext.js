import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);   // login depends on userId, not token
  }, []);

  const login = (id, role) => {
    localStorage.setItem("userId", id);
    localStorage.setItem("role", role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
