import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile(){
  const { user } = useContext(AuthContext);
  if(!user) return <div style={{padding:20}}>Not logged in</div>;
  return (
    <div style={{padding:20}}>
      <h2>Profile</h2>
      <p><strong>{user.first_name} {user.last_name}</strong></p>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
