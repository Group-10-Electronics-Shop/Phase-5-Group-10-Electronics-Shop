import React from "react";

const DEFAULT_CATEGORIES = ["All","Phones","Televisions","Computers","Accessories","Cameras","Tablets","Audio","Gaming","Wearables","Desktops","Laptops","Kitchenware"];

export default function CategoryList({ categories = DEFAULT_CATEGORIES }){
  return (
    <aside className="categories-sidebar" aria-label="Categories">
      <ul className="categories-list">
        {categories.map((c)=>(
          <li key={c} className="cat-item">{c}</li>
        ))}
      </ul>
    </aside>
  );
}
