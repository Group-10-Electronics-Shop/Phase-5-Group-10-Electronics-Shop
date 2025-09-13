import { Link } from "react-router-dom";
import homeBanner from "../assets/home-banner.jpg";

export default function Home() {
  return (
    <div>
      {/* Hero Image */}
      <div className="relative">
        <img
          src={homeBanner}
          alt="Electronics Shop Banner"
          className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] object-cover"
        />
        {/* Overlay with text + button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Welcome to Electronics Shop
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl">
            Best Deals on Electronics
          </p>
          <Link
            to="/products"
            className="mt-4 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base md:text-lg lg:text-xl font-semibold rounded-lg shadow-md transition"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6">
          Explore Our Categories
        </h2>
        <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg">
          Explore our latest products and enjoy the best deals.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
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
