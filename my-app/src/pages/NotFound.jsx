import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-14">
      <div className="max-w-2xl w-full bg-white border rounded-2xl p-8 shadow-sm text-center">
        <p className="text-xs tracking-widest text-gray-500 mb-2">Home / 404 Error</p>

        <h1 className="text-3xl md:text-4xl font-semibold mb-3">404 Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you were looking for doesn’t exist. You can go back to the home page.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white hover:opacity-90"
          >
            Back to home page
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border hover:bg-gray-50"
          >
            Contact support
          </Link>
        </div>

        {/* Support / Address block (KE details) */}
        <div className="mt-8 text-sm text-left grid gap-2 text-gray-600">
          <div><span className="font-medium">Email:</span> electronicsshop@gmail.com</div>
          <div><span className="font-medium">Phone:</span> +254 711 012 3456</div>
          <div><span className="font-medium">Address:</span> 00134 Nairobi, Kenya</div>
        </div>
      </div>
    </div>
  );
}