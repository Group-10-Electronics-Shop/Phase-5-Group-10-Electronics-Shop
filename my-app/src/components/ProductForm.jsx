import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import sampleData from "../data/sampleProducts.json";

/**
 * ProductForm: mode "create" or "edit".
 * Persists to localStorage under "localProducts" so demo create/edit/delete persist across reloads.
 */

function readLocalProducts(){
  try {
    const raw = localStorage.getItem('localProducts');
    return raw ? JSON.parse(raw) : [];
  } catch(e){ return []; }
}

function writeLocalProducts(arr){
  localStorage.setItem('localProducts', JSON.stringify(arr || []));
}

export default function ProductForm({ mode = "create" }){
  const { id } = useParams();
  const navigate = useNavigate?.();
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '/images/placeholder.png',
    badge: ''
  });

  useEffect(()=> {
    if(mode === "edit" && id){
      // look up in localProducts first, then sampleData
      const lp = readLocalProducts();
      const foundLocal = lp.find(p => String(p.id) === String(id) && !p._deleted);
      if(foundLocal) {
        setForm({...foundLocal});
        return;
      }
      const foundSample = sampleData.find(p => String(p.id) === String(id));
      if(foundSample) setForm({...foundSample});
    }
    if(mode === "create"){
      // default id assign will be on submit
      setForm(f => ({...f, id: null}));
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({...f, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lp = readLocalProducts();

    if(mode === "create"){
      // pick id = max(existing ids) + 1 (consider both sample and local)
      const existingIds = [
        ...sampleData.map(s => Number(s.id)),
        ...lp.map(s => Number(s.id))
      ].filter(n => !Number.isNaN(n));
      const nextId = (existingIds.length ? Math.max(...existingIds) : 0) + 1;
      const newProd = {...form, id: nextId};
      lp.push(newProd);
      writeLocalProducts(lp);
      alert("Product created (saved to localStorage for demo).");
      navigate?.('/products');
      return;
    }

    // edit mode: upsert into localProducts
    const idx = lp.findIndex(x => String(x.id) === String(form.id));
    if(idx >= 0) {
      lp[idx] = {...lp[idx], ...form};
    } else {
      // if editing a sample product, add override
      lp.push({...form});
    }
    writeLocalProducts(lp);
    alert("Product updated (saved to localStorage for demo).");
    navigate?.('/products');
  };

  return (
    <main className="container" style={{padding:20}}>
      <div className="card" style={{padding:16}}>
        <h2>{mode === "create" ? "Add product" : `Edit product ${form.name || ''}`}</h2>

        <form onSubmit={handleSubmit} style={{display:'grid', gap:12, marginTop:12}}>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Description
            <input name="description" value={form.description} onChange={handleChange} />
          </label>

          <label>
            Category
            <input name="category" value={form.category} onChange={handleChange} />
          </label>

          <label>
            Price
            <input name="price" type="number" value={form.price} onChange={handleChange} />
          </label>

          <label>
            Image URL
            <input name="image_url" value={form.image_url} onChange={handleChange} />
          </label>

          <label>
            Badge
            <input name="badge" value={form.badge} onChange={handleChange} />
          </label>

          <div style={{display:'flex', gap:8}}>
            <button className="btn" type="submit">{mode === "create" ? "Create" : "Save"}</button>
            <button type="button" className="btn-outline" onClick={()=> navigate?.(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
}