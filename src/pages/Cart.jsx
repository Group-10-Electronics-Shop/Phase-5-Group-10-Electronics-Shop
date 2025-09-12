export default function Cart() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    </div>
  );
}
