

import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import * as apiClient from '../api-client';
import { toast } from 'react-toastify';
import React from 'react';

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    image: FileList;
};

const Register = () => {

    const [loading, setLoading] = React.useState(false); // Add loading state
    
    const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

    const mutation = useMutation(async (formData: FormData) => {
        return apiClient.register(formData); // Ensure this returns a promise
    }, {
        onSuccess: () => {
            // alert("Please verify your email. A verification link has been sent to your email address.");
            // navigate("/verify-email"); // Redirect to a verification page
            toast.success("Please verify your email. A verification link has been sent to your email address.");
        },
        onError: (error: Error) => {
            console.error("Error:", error.message);
        },
    });

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        setLoading(true); // Set loading to true when submission starts
        try {
            const formData = new FormData();
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("email", data.email);
            formData.append("password", data.password);
            formData.append("confirmPassword", data.confirmPassword);

            if (data.image && data.image[0]) {
                formData.append("image", data.image[0]);
            }

            await mutation.mutateAsync(formData);
        } catch (error) {
            console.error('Submission error:', error);
        }
    };

    return (
        <form className="flex flex-col gap-5 mx-auto my-8 max-w-lg" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-3xl font-bold">Create an account</h2>
            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input 
                        className="border rounded w-full py-1 px-2"
                        {...register("firstName", { required: "This field is required" })}
                    />
                    {errors.firstName && (
                        <span className="text-red-500">{errors.firstName.message}</span>
                    )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input 
                        className="border rounded w-full py-1 px-2"
                        {...register("lastName", { required: "This field is required" })}
                    />
                    {errors.lastName && (
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}
                </label>
            </div>
            <label className="text-gray-700 text-sm font-bold">
                Email
                <input 
                    type="email" 
                    className="border rounded w-full py-1 px-2"
                    {...register("email", { required: "This field is required" })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold">
                Password
                <input 
                    type="password" 
                    className="border rounded w-full py-1 px-2"
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
            <label className="text-gray-700 text-sm font-bold">
                Confirm Password
                <input 
                    type="password" 
                    className="border rounded w-full py-1 px-2"
                    {...register("confirmPassword", {
                        validate: (val) => {
                            if (!val) {
                                return "This field is required";
                            } else if (watch("password") !== val) {
                                return "Your passwords do not match";
                            }
                        }
                    })}
                />
                {errors.confirmPassword && (
                    <span className="text-red-500">
                        {errors.confirmPassword.message}
                    </span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold">
                Upload Profile Image
                <input 
                    type="file" 
                    className="border rounded w-full py-1 px-2"
                    {...register("image", { required: "Please upload an image" })}
                />
                {errors.image && (
                    <span className="text-red-500">{errors.image.message}</span>
                )}
            </label>
            <button disabled={loading}
                type="submit"
                className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
            >
                {loading?"Submitting":"Create Account"}
            </button>
            <p className="text-center mt-4">
                    Already have an account? 
                    <Link to="/sign-in" className="text-blue-600 hover:underline ml-1">Login</Link>
                </p>
        </form>
    );
}

export default Register;


