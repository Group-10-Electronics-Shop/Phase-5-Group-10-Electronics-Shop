import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Signup from "./pages/Signup";
import ProductForm from "./components/ProductForm";

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main style={{flex:1}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products/new" element={<ProductForm mode="create" />} />
          <Route path="/products/:id/edit" element={<ProductForm mode="edit" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}