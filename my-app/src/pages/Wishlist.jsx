import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  if (wishlistItems.length === 0) {
    return <p className="text-center py-10">Your wishlist is empty.</p>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="border rounded-lg shadow p-4 relative">
            <Link to={`/products/${item.id}`}>
              <img
                src={item.image_url || item.image}
                alt={item.name}
                className="rounded w-full h-48 object-cover mb-2"
              />
              <p className="font-semibold">{item.name}</p>
            </Link>
            <p className="text-gray-700 text-sm mb-1">{item.description}</p>
            <p className="text-blue-600 font-bold">KES {item.price.toLocaleString()}</p>

            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => dispatch(addToCart(item))}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex-1"
              >
                Add to Cart
              </button>
              <button
                onClick={() => dispatch(removeFromWishlist(item.id))}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex-1"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
