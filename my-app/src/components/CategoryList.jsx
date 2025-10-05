import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const DEFAULT = [
  "All",
  "Phones",
  "Televisions",
  "Computers",
  "Accessories",
  "Cameras",
  "Tablets",
  "Audio",
  "Gaming",
  "Wearables",
  "Desktops",
  "Laptops",
  "Kitchenware",
];

export default function CategoryList({ items = DEFAULT }) {
  const [params] = useSearchParams();
  const active = params.get("cat") || "All";

  return (
    <div className="bg-white border-y">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
          {items.map((c) => {
            const isActive = active === c;
            const to =
              c === "All" ? "/products" : `/products?cat=${encodeURIComponent(c)}`;
            return (
              <Link
                key={c}
                to={to}
                className={
                  "px-3 py-1 rounded-full border text-sm whitespace-nowrap " +
                  (isActive
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white hover:bg-gray-50")
                }
              >
                {c}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}