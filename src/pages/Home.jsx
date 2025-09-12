import { useSelector } from "react-redux";
import { ProductCard} from "../components/ProductCard";

function Home() {
  const products = useSelector((state) => state.products.items);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Featured Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default Home;