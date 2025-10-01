// src/pages/WishlistPage.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../store/slices/wishlistSlice";
import { Link } from "react-router-dom";

const getImageUrl = (product) => {
  let imageUrl = "https://via.placeholder.com/100";
  try {
    if (Array.isArray(product.image_urls)) {
      imageUrl = product.image_urls[0];
    } else if (typeof product.image_urls === "string") {
      const parsed = JSON.parse(product.image_urls);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imageUrl = parsed[0];
      }
    }
  } catch {
    imageUrl = "https://via.placeholder.com/100";
  }
  return imageUrl;
};

const getPrice = (product) =>
  product.current_price || product.sale_price || product.price || 0;

function WishlistPage() {
  const wishlist = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto card p-6 text-center">
        <p className="text-gray-600">Your wishlist is empty.</p>
        <Link to="/" className="btn mt-4">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="card flex items-center gap-4 p-4">
            <img
              src={getImageUrl(product)}
              alt={product.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.category_name}</p>
              <p className="text-teal-600 font-bold mt-2">
                KES {Number(getPrice(product)).toLocaleString()}
              </p>
            </div>
            <button
              className="ml-4 text-red-500 hover:text-red-700"
              onClick={() => dispatch(removeFromWishlist(product.id))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
