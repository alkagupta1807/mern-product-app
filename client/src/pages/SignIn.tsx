

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [authError, setAuthError] = useState<string | null>(null); // State to hold authentication errors
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, formState: { errors }, handleSubmit } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      toast.success("Sign in successful!");
      await queryClient.invalidateQueries("validateToken");
      setAuthError(null); // Clear the error on successful login
      navigate("/");
    },
    onError: (error: Error) => {
      if (error && error.message) {
        toast.error(error.message || "Invalid credentials");
        setAuthError(error.message || "Invalid credentials");
      } else {
        toast.error("An error occurred. Please try again.");
        setAuthError("An error occurred. Please try again.");
      }
    }
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="flex justify-center items-center ">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <h2 className="text-3xl font-bold mb-6">Sign In</h2>
          {authError && <span className="text-red-500">{authError}</span>}
          <label className="text-gray-700 text-sm font-bold flex-1">
            Email
            <input
              type="email"
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("email", { required: "This field is required" })}
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Password
            <input
              type="password"
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </label>
          <span className="flex items-center justify-between">
            <span className="text-sm">
              Not Registered?{" "}
              <Link className="underline" to="/register">Create an account here</Link>
            </span>
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
            >
              Login
            </button>
          </span>
        </form>
        <div className="forgot-password mt-4">
          <Link to="/forget-password">Forgot Password?</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;

// import { useForm } from "react-hook-form";
// import { useMutation, useQueryClient } from "react-query";
// import * as apiClient from "../api-client";
// import { useAppContext } from "../contexts/AppContext";
// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { toast } from "react-toastify";

// export type SignInFormData = {
//   email: string;
//   password: string;
// };

// const SignIn = () => {
//   const [authError, setAuthError] = useState<string | null>(null); // State to hold authentication errors
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { register, formState: { errors }, handleSubmit } = useForm<SignInFormData>();

//   const mutation = useMutation(apiClient.signIn, {
//     onSuccess: async () => {
//       console.log("user has been signed in ");
//       toast.success("Sign in successful!");
//       await queryClient.invalidateQueries("validateToken");
//       setAuthError(null); // Clear the error on successful login
//       navigate("/");
//     },
//     onError: (error: Error) => {
//       if (error && error.message) {
//         setAuthError(error.message || "Invalid credentials");
//         toast.error(error.message || "Invalid credentials");
//       } else {
//         setAuthError("An error occurred. Please try again.");
//         toast.error("An error occurred. Please try again.");
//       }
//     }
//   });

//   const onSubmit = handleSubmit((data) => {
//     mutation.mutate(data);
//   });

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <form className="flex flex-col gap-5 p-8 rounded shadow-lg w-full max-w-md" onSubmit={onSubmit}>
//         <h2 className="text-3xl font-bold">Sign In</h2>
//         {/* Display authentication error */}
//         {authError && <span className="text-red-500">{authError}</span>}
//         <label className="text-gray-700 text-sm font-bold flex-1">
//           Email
//           <input
//             type="email"
//             className="border rounded w-full py-1 px-2 font-normal"
//             {...register("email", { required: "This field is required" })}
//           />
//           {errors.email && <span className="text-red-500">{errors.email.message}</span>}
//         </label>
//         <label className="text-gray-700 text-sm font-bold flex-1">
//           Password
//           <input
//             type="password"
//             className="border rounded w-full py-1 px-2 font-normal"
//             {...register("password", {
//               required: "This field is required",
//               minLength: {
//                 value: 6,
//                 message: "Password must be at least 6 characters"
//               }
//             })}
//           />
//           {errors.password && <span className="text-red-500">{errors.password.message}</span>}
//         </label>
//         <span className="flex items-center justify-between">
//           <span className="text-sm">
//             Not Registered?{" "}
//             <Link className="underline" to="/register">
//               Create an account here
//             </Link>
//           </span>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
//           >
//             Login
//           </button>
//         </span>
//       </form>
//       {/* Add Forgot Password Link */}
//       <div className="forgot-password">
//         <Link to="/forget-password">Forgot Password?</Link>
//       </div>
//     </div>
//   );
// };

// export default SignIn;
