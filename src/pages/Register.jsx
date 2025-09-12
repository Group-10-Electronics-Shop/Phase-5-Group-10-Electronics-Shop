import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/auth/authSlice";

function Register() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name")}
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        <button className="w-full bg-green-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
