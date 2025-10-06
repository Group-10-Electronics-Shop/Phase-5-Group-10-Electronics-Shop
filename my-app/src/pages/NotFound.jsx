import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-14">
      <div className="max-w-2xl w-full bg-white border rounded-2xl p-8 shadow-sm text-center">
        <h1 className="text-4xl font-bold mb-3">404 Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you were looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}