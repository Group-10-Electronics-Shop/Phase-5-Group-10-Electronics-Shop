import React from "react";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-blue-600">Electronics Shop</h1>
        <p className="mt-2 text-gray-700">
          Welcome to our online electronics store. 🚀
        </p>
      </div>
    </div>
  );
}

export default App;
