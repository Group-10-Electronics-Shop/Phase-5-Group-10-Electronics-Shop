import React from "react";
import { isAdmin as authIsAdmin } from "../utils/auth";

export default function ProductCard({ product, onView, onEdit, onDelete, isAdmin }) {
  const admin = (typeof isAdmin === 'boolean') ? isAdmin : authIsAdmin();

  return (
    <article className="card" style={{display:'flex', flexDirection:'column', gap:8}}>
      <div style={{position:'relative'}}>
        <img
          src={product.image_url || '/images/placeholder.png'}
          alt={product.name || 'product'}
          style={{width:'100%', height:160, objectFit:'cover', borderRadius:8}}
          onError={(e)=> e.currentTarget.src = "/images/placeholder.png"}
        />
        {product.badge && (
          <div style={{
            position:'absolute', left:8, top:8, background:'#ef4444', color:'#fff',
            padding:'4px 8px', borderRadius:6, fontSize:12
          }}>{product.badge}</div>
        )}
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:4}}>
        <div style={{fontWeight:700}}>{product.name}</div>
        {product.category && <div style={{fontSize:12, color:'#6b7280'}}>{product.category}</div>}
        <div style={{fontWeight:600}}>{typeof product.price === 'number' ? `KES ${product.price.toLocaleString()}` : product.price}</div>
        <div style={{display:'flex', gap:8, marginTop:6}}>
          <button className="btn-sm" onClick={()=> onView?.(product)}>View</button>
          {admin && <>
            <button className="btn-sm" onClick={()=> onEdit?.(product)}>Edit</button>
            <button className="btn-sm btn-danger" onClick={()=> onDelete?.(product)}>Delete</button>
          </>}
        </div>
      </div>
    </article>
  );
}