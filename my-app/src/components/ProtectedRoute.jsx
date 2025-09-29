import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null; // or a loader
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
