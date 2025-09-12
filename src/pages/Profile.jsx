export default function Profile() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p><span className="font-semibold">Name:</span> John Doe</p>
        <p><span className="font-semibold">Email:</span> johndoe@example.com</p>
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );
}
