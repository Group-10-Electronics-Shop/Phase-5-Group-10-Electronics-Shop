
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage(){
  const { login } = useContext(AuthContext);
  const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(null);
  const navigate = useNavigate();

  async function onSubmit(e){
    e.preventDefault();
    setError(null);
    try {
      await login(email,password);
      navigate("/");
    } catch (err){
      setError(err?.response?.data?.message || err?.message || "Login failed");
    }
  }

  return (
    <div style={{maxWidth:480, margin:"3rem auto", padding:20}}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div><label>Email</label><br/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/></div>
        <div style={{marginTop:8}}><label>Password</label><br/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" required/></div>
        {error && <div style={{color:"crimson", marginTop:8}}>{error}</div>}
        <button style={{marginTop:12}} type="submit">Login</button>
      </form>
    </div>
  );
}
