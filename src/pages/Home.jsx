export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome to Electronics Shop</h1>
      <p className="text-center text-gray-600">
        Explore our latest products and enjoy the best deals.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h2 className="text-lg font-semibold">Smartphones</h2>
          <p className="text-gray-500">Latest models available</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h2 className="text-lg font-semibold">Laptops</h2>
          <p className="text-gray-500">Work & Gaming laptops</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h2 className="text-lg font-semibold">Accessories</h2>
          <p className="text-gray-500">Headphones, chargers & more</p>
        </div>
      </div>
    </div>
  );
}
