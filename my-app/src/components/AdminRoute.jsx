import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../utils/auth";

export default function AdminRoute({ children }) {
  const loc = useLocation();
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }
  return children;
}