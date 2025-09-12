import { Link } from "react-router-dom";

export default function Products() {
  // Later, fetch products from Redux / API
  const products = [
    { id: 1, name: "Laptop", price: "$1000" },
    { id: 2, name: "Smartphone", price: "$700" },
    { id: 3, name: "Headphones", price: "$150" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="border p-4 rounded shadow hover:shadow-lg"
          >
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
