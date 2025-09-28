import React, { useEffect, useState } from "react";
import client from "../api/client";
import { Link } from "react-router-dom";

export default function Products(){
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ let mounted=true;
    client.get("/api/products")
      .then(r => { if(mounted) setProducts(r.data?.data?.products || []); })
      .catch(e=>console.error("products error",e))
      .finally(()=> mounted && setLoading(false));
    return ()=> mounted=false;
  },[]);
  if(loading) return <div style={{padding:20}}>Loading products…</div>;
  return (
    <div style={{padding:20}}>
      <h2>Products</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
        {products.map(p => (
          <div key={p.id} style={{border:"1px solid #eee",padding:12,borderRadius:8}}>
            <h3>{p.name}</h3>
            <div style={{fontSize:13, color:"#666"}}>{p.brand} — {p.model}</div>
            <div style={{marginTop:8}}>${p.current_price?.toFixed(2)}</div>
            <div style={{marginTop:8}}>
              <Link to={`/products/${p.id}`}>View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
