import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as apiRegister } from "../api/auth";

export default function Register(){
  const [email,setEmail]=useState("");
  const [first_name,setFirst]=useState("");
  const [last_name,setLast]=useState("");
  const [password,setPassword]=useState("");
  const [msg,setMsg]=useState(null);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const payload = { email, password, first_name, last_name };
      const res = await apiRegister(payload);
      if (res.success) {
        setMsg("Registered — redirecting to login...");
        setTimeout(()=>nav("/login"),800);
      } else {
        setMsg(JSON.stringify(res.errors || res));
      }
    } catch (err) {
      setMsg("Register failed: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Register</h2>
      {msg && <div style={{marginBottom:12,color:"crimson"}}>{msg}</div>}
      <form onSubmit={submit} style={{maxWidth:420}}>
        <div><label>First name</label><input value={first_name} onChange={e=>setFirst(e.target.value)} required /></div>
        <div><label>Last name</label><input value={last_name} onChange={e=>setLast(e.target.value)} required /></div>
        <div><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></div>
        <div><label>Password</label><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required /></div>
        <div style={{marginTop:10}}><button type="submit">Register</button></div>
      </form>
    </div>
  );
}
