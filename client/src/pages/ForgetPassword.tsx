

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type FormData = {
  email: string;
};

const ForgetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email: data.email })
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("Link sent to reset password");
      } else {
        toast.error(result.message || "An error occurred");
      }
      
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Reset your Password</h2>

        <label className="text-gray-700 text-sm font-bold mb-4 block">
          Email
          <input
            type="email"
            className="border rounded w-full py-2 px-3 mt-1 mb-2"
            {...register("email", { 
              required: "This field is required", 
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address"
              }
            })}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </label>

        <button
          type="submit"
          className={`bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl w-full ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default ForgetPassword;
