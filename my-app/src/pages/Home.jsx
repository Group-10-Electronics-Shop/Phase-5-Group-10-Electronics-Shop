import React, { useEffect, useState } from "react";
import client from "../api/client";

export default function Home(){
  const [products, setProducts] = useState([]);
  useEffect(()=>{ (async ()=>{
    try {
      const res = await client.get('/api/products');
      setProducts(res.data?.data?.products || []);
    } catch (e) { console.error(e); }
  })(); }, []);
  return (
    <div style={{padding:20}}>
      <h2>Home / Products snapshot</h2>
      <ul>
        {products.length===0 && <li>No products yet (or failed to fetch)</li>}
        {products.map(p => <li key={p.id}>{p.name} — ${p.current_price}</li>)}
      </ul>
    </div>
  );
}
