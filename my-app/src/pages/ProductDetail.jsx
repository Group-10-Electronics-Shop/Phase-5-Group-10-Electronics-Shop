import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";

export default function ProductDetail(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  useEffect(()=>{ let mounted=true;
    client.get(`/api/products/${id}`)
      .then(r => { if(mounted) setProduct(r.data?.data || null); })
      .catch(e=>console.error("product detail error", e));
    return ()=> mounted = false;
  },[id]);
  if(!product) return <div style={{padding:20}}>Loading product…</div>;
  return (
    <div style={{padding:20}}>
      <h2>{product.name}</h2>
      <div style={{color:"#666"}}>{product.brand} — {product.model}</div>
      <p style={{marginTop:12}}>{product.description}</p>
      <div style={{marginTop:12, fontWeight:700}}>${product.current_price?.toFixed(2)}</div>
      <pre style={{whiteSpace:"pre-wrap",marginTop:12}}>{product.specifications}</pre>
    </div>
  );
}
