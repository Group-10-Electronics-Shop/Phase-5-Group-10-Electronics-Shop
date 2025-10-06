import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  
  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has admin or manager role
  const isAdmin = user.role === "admin" || user.role === "manager";
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
          <p className="text-sm text-gray-500">Current role: {user.role}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  
  return children;
}

export default AdminRoute;