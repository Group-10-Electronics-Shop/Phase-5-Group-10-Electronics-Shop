import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData))
      .unwrap()
      .then(() => navigate('/account'))
      .catch((err) => {
        console.error("Login failed:", err);
        alert(err?.message || 'Login failed');
      });
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn w-full">Login</button>
      </form>
      <p className="mt-4 text-sm">
        Don’t have an account? <Link to="/signup" className="text-teal-600">Sign Up</Link>
      </p>
    </div>
  );
}

export default LoginPage;
