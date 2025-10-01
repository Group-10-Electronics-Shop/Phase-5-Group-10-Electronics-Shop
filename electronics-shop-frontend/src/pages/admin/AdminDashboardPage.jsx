import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../../store/slices/adminSlice';

function AdminDashboardPage() {
  const dispatch = useDispatch();
  const { dashboard, status } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  if (status === 'loading') return <div className="p-6">Loading dashboard...</div>;
  if (!dashboard) return <div className="p-6">No dashboard data available.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-4">
          <h2 className="font-semibold">Revenue</h2>
          <p className="text-xl text-teal-600">KES {dashboard.revenue?.toLocaleString() || 0}</p>
        </div>
        <div className="card p-4">
          <h2 className="font-semibold">Total Orders</h2>
          <p className="text-xl">{dashboard.orders_count || 0}</p>
        </div>
        <div className="card p-4">
          <h2 className="font-semibold">Active Users</h2>
          <p className="text-xl">{dashboard.active_users || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
