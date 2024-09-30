import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  const isTokenExpired = () => {
    const expiresAt = localStorage.getItem("expires_at");
    if (!expiresAt) return true;

    const now = new Date();
    const expirationDate = new Date(expiresAt);
    return now >= expirationDate;
  };

  if (!token || isTokenExpired()) {
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
    return <Navigate to="/login" replace state={{ isSessionExpired: true }} />;
  }

  return children;
};

export default PrivateRoute;