import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Product Detail - {id}</h2>
      <p className="text-gray-700 mt-4">
        Detailed information about product {id} will be displayed here.
      </p>
      <button className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Add to Cart
      </button>
    </div>
  );
}
