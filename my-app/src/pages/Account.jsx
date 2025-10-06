import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Please log in to view your account</p>
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Account</h1>
          <p className="text-sm text-gray-600">Welcome, {user.first_name || user.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-3">Manage Account</h3>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 rounded ${
                  activeTab === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-3 py-2 rounded ${
                  activeTab === 'orders' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                My Orders
              </button>
            </nav>
          </div>

          <div className="lg:col-span-3 bg-white p-6 rounded border">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">My Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <p className="text-gray-700">{user.first_name} {user.last_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <p className="text-gray-700">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <p className="text-gray-700 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">My Orders</h2>
                <p className="text-gray-600">No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}