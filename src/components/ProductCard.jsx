import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300">
      <img
        src={product.image || "/vite.svg"}
        alt={product.name}
        className="w-full h-48 sm:h-40 md:h-48 object-cover rounded-md mb-4"
      />
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      <p className="text-gray-600 text-sm sm:text-base mb-3">${product.price}</p>
      <Link
        to={`/products/${product.id}`}
        className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition transform hover:scale-105"
      >
        View Details
      </Link>
    </div>
  );
}

export default ProductCard;
