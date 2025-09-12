import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img
        src={product.image || "/vite.svg"}
        alt={product.name}
        className="w-full h-40 object-cover mb-4"
      />
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-600">${product.price}</p>
      <Link
        to={`/products/${product.id}`}
        className="mt-2 inline-block bg-blue-600 text-white px-3 py-1 rounded"
      >
        View Details
      </Link>
    </div>
  );
}

export default ProductCard;
