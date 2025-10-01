import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

function SignUpPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ frontend-only check
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    // ✅ only send what backend expects
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone || null,
      password: formData.password,
    };

    dispatch(registerUser(payload))
      .unwrap()
      .then(() => {
        navigate("/account");
      })
      .catch((err) => {
        console.error("Registration failed:", err);
        alert(err?.message || "Registration failed");
      });
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          className="input"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          className="input"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
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
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="input"
          value={formData.phone}
          onChange={handleChange}
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
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          className="input"
          value={formData.confirm_password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn w-full">
          Create Account
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-teal-600">
          Login
        </Link>
      </p>
    </div>
  );
}

export default SignUpPage;
