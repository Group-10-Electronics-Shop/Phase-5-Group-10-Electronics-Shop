import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Product Details</h2>
      <p>Details for product ID: {id}</p>
    </div>
  );
}

export default ProductDetails;
