import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App(){
  return (
    <div>
      <nav style={{padding:12, borderBottom:"1px solid #eee"}}>
        <Link to="/">Home</Link>{" | "}
        <Link to="/products">Products</Link>{" | "}
        <Link to="/profile">Profile</Link>{" | "}
        <Link to="/login">Login</Link>{" | "}
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/products/:id" element={<ProductDetail/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="*" element={<div style={{padding:20}}>Not found</div>} />
      </Routes>
    </div>
  );
}
