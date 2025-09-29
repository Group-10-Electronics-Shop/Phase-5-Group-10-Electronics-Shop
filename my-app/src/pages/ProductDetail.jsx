import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { addToWishlist } from "../features/wishlist/wishlistSlice";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const product = useSelector((state) =>
    state.products.items.find((p) => p.id === parseInt(id))
  );
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = product
    ? wishlistItems.find((i) => i.id === product.id)
    : false;

  if (!product)
    return <p className="text-center py-10 text-red-500">Product not found.</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={product.image}
          alt={product.name}
          className="rounded w-full h-96 object-cover"
        />
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-blue-600 font-bold text-xl">
            KES {product.price.toLocaleString()}
          </p>

          <div className="flex space-x-4">
            <button
              onClick={() => dispatch(addToCart(product))}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
            <button
              onClick={() => dispatch(addToWishlist(product))}
              className={`px-4 py-2 rounded border ${
                isWishlisted
                  ? "text-red-500 border-red-500"
                  : "text-gray-700 border-gray-300"
              } hover:text-red-500`}
            >
              {isWishlisted ? "Wishlisted ♥" : "Add to Wishlist ♥"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
