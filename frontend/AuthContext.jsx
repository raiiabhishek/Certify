import React, { createContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap the application
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [role, setRole] = useState(null);
  const [id, setId] = useState(null);
  // Load token from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("role");
    const id = localStorage.getItem("id");
    if (token) setAuthToken(token);
    if (userRole) setRole(userRole);
    if (id) setId(id);
  }, []);

  // Function to save token after login
  const login = (token, userRole, id) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("role", userRole);
    localStorage.setItem("id", id);
    setAuthToken(token);
    setRole(userRole);
    setId(id);
  };

  // Function to log out
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    setAuthToken(null);
    setRole(null);
    setId(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, role, id, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
