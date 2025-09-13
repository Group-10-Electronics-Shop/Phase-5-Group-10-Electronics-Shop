export default function Register() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300"
          />
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
