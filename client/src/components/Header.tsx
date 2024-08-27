
export interface User {
    email: string;
    name: string;
    image?: string; 
    
  }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { fetchUserDetails } from "../api-client";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Header = () => {
    const [user,setUser]=useState<User | null>(null);

  const { isLoggedIn, isLoading } = useAppContext(); 
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(()=>{
    const getUserDetails=async()=>{
        try {
            const userDetails=await fetchUserDetails();
            setUser(userDetails)
        } catch (error:any) {
            throw new Error(error.message || "failed")
        }
    }
    getUserDetails()
  },[])

  if (isLoading) {
    return (
      <div className="bg-blue-800 py-6">
        <div className="container mx-auto flex justify-center">
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }

  

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex items-center justify-between px-6">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">MERN</Link>
        </span>
        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
             <Link
                className="text-white px-4 py-2 font-bold hover:bg-blue-600 rounded"
                to="/my-products"
              >
                Products
              </Link> 
              {user && (
                <img
                  src={`${API_BASE_URL}/uploads/${user?.image}`} 
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={toggleDropdown}
                />
               )} 
              {dropdownOpen && (
                <div className="absolute top-16 right-6 bg-white text-blue-600 border rounded shadow-lg z-10">
                  <Link
                    to="/update-password"
                    className="block px-4 py-2 font-bold hover:bg-gray-100"
                  >
                    Update Password
                  </Link>
                  <div
                    onClick={toggleDropdown}
                    className="block px-4 py-2 font-bold hover:bg-gray-100 cursor-pointer"
                  >
                    <SignOutButton />
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/sign-in"
              className="bg-white text-blue-600 px-4 py-2 font-bold hover:bg-gray-100 rounded"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
