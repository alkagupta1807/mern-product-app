

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FormData = {
  password: string;
  confirmPassword: string;
};

const UpdatePassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate=useNavigate()
 

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // Assuming JWT is stored in local storage
        },
        credentials: 'include',
        body: JSON.stringify({ password: data.password })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Password updated successfully');
        navigate('/sign-in')
      } else {
        toast.error(result.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6">Update Password</h2>

        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}

        <label className="text-gray-700 text-sm font-bold">
          New Password
          <input
            type="password"
            className="border rounded w-full py-2 px-3 mt-1 mb-4"
            {...register('password', { 
              required: 'Password is required', 
              minLength: { value: 6, message: 'Password must be at least 6 characters long' } 
            })}
          />
        </label>

        <label className="text-gray-700 text-sm font-bold">
          Confirm Password
          <input
            type="password"
            className="border rounded w-full py-2 px-3 mt-1 mb-4"
            {...register('confirmPassword', { 
              required: 'Confirm Password is required' 
            })}
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 w-full"
        >
          Update Password
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default UpdatePassword;

