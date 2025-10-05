import React from 'react'
import { Link } from 'react-router-dom'

export default function LoginDone() {
  return (
    <div style={{padding:40}}>
      <h1>Login succeeded (debug)</h1>
      <p>This confirms the login flow completed and stored a token — it does not auto-redirect.</p>
      <p><Link to="/">Back to home</Link></p>
      <p><Link to="/products">Go to products (manual)</Link></p>
    </div>
  )
}