export default function Checkout() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg focus:ring focus:ring-purple-300"
        />
        <input
          type="text"
          placeholder="Address"
          className="w-full p-3 border rounded-lg focus:ring focus:ring-purple-300"
        />
        <input
          type="text"
          placeholder="City"
          className="w-full p-3 border rounded-lg focus:ring focus:ring-purple-300"
        />
        <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
          Place Order
        </button>
      </form>
    </div>
  );
}
