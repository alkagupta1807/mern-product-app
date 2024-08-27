
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type FormData = {
  password: string;
  confirmPassword?: string;
};

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const navigate=useNavigate()
  const [loading, setLoading] = useState(false);
  const token = window.location.pathname.split("/").pop();

  const onSubmit = async (data: { password: string; confirmPassword?: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ password: data.password })
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("Password reset successfully");
        navigate('/sign-in')
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
          Password
          <input
            type="password"
            className="border rounded w-full py-2 px-3 mt-1 mb-2"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </label>

        {/* Uncomment this section if you want to use confirm password validation */}
         
        <label className="text-gray-700 text-sm font-bold mb-4 block">
          Confirm Password
          <input
            type="password"
            className="border rounded w-full py-2 px-3 mt-1 mb-2"
            {...register("confirmPassword", {
              validate: (value) => {
                if (!value) {
                  return "This field is required";
                } else if (watch("password") !== value) {
                  return "Your passwords do not match";
                }
              }
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword.message}</span>
          )}
        </label>
        

        <button
          type="submit"
          className={`bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl w-full ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default ResetPassword;
