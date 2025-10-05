import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup(){
  const navigate = useNavigate?.();
  const [form, setForm] = useState({
    name: "",
    emailOrPhone: "",
    password: "",
    confirm: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.emailOrPhone.trim()) e.emailOrPhone = "Email or phone required";
    // very simple email/phone check
    if (form.emailOrPhone && !/^\S+@\S+\.\S+$|^\+?\d{6,}$/.test(form.emailOrPhone))
      e.emailOrPhone = "Enter valid email or phone";
    if (!form.password) e.password = "Password is required";
    if (form.password && form.password.length < 6) e.password = "Password must be ≥6 chars";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);

    try {
      // Simulate API call. Replace with real request:
      await new Promise(r => setTimeout(r, 700));
      // example: local success -> go to login or home
      alert("Account created — this is a demo flow. Implement backend to persist.");
      navigate?.("/login");
    } catch (err) {
      console.error(err);
      alert("Sign up failed — check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container signup-page" style={{paddingTop:20, paddingBottom:40}}>
      <div className="card signup-card">
        <div className="signup-grid">
          <div className="signup-left">
            <h2>Create an account</h2>
            <p className="muted">Enter your details below</p>

            <form onSubmit={handleSubmit} className="signup-form" noValidate>
              <label className="form-label">
                Name
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </label>

              <label className="form-label">
                Email or Phone Number
                <input name="emailOrPhone" value={form.emailOrPhone} onChange={handleChange} placeholder="you@example.com or +25471234567" />
                {errors.emailOrPhone && <div className="field-error">{errors.emailOrPhone}</div>}
              </label>

              <label className="form-label">
                Password
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
                {errors.password && <div className="field-error">{errors.password}</div>}
              </label>

              <label className="form-label">
                Confirm Password
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Confirm password" />
                {errors.confirm && <div className="field-error">{errors.confirm}</div>}
              </label>

              <div style={{display:'flex', gap:8, marginTop:12}}>
                <button className="btn" type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Account"}
                </button>
                <button type="button" className="btn-outline" onClick={()=> navigate?.("/")}>Cancel</button>
              </div>

              <div style={{marginTop:12, fontSize:13}} className="muted">
                Or sign up with
              </div>

              <div style={{display:'flex', gap:8, marginTop:8}}>
                <button type="button" className="btn-social">Sign up with Google</button>
              </div>
            </form>
          </div>

          <div className="signup-right" aria-hidden="true">
            <div className="signup-visual">
              <h3>Quality gadgets & fast delivery</h3>
              <p className="muted">Shop top picks, flash deals and fast shipping.</p>
              <img src="/images/34_213.png" alt="Hero" onError={(e)=> e.currentTarget.src='/images/placeholder.png'} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}