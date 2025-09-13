import homeBanner from "../assets/home-banner.jpg";

export default function Home() {
  return (
    <div>
      {/* Hero Image */}
      <div className="relative">
        <img
          src={homeBanner}
          alt="Electronics Shop Banner"
          className="w-full h-64 md:h-96 object-cover"
        />
        {/* Optional overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white">
          <h1 className="text-4xl font-bold">Welcome to Electronics Shop</h1>
          <p className="mt-2 text-lg">Best Deals on Electronics</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Explore Our Categories
        </h2>
        <p className="text-center text-gray-600">
          Explore our latest products and enjoy the best deals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Smartphones</h3>
            <p className="text-gray-500">Latest models available</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Laptops</h3>
            <p className="text-gray-500">Work & Gaming laptops</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold">Accessories</h3>
            <p className="text-gray-500">Headphones, chargers & more</p>
          </div>
        </div>
      </div>
    </div>
  );
}
