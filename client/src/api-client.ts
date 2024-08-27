import { SignInFormData } from "./pages/SignIn";
export type ProductType = {
  _id: string;
  // userId: string,
  name: string;
  category: string;
  description: string;
  price: number;
  // stock: number,
  // status: string,
  brand: string;
  sizes: string[];
  colors: string[];
  imageFiles: FileList;
  imageUrls: string[];
  // lastUpdated: Date
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (registerFormData: FormData): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    body: registerFormData,
  });
  if (!response.ok) {
    throw new Error("Error");
  }
  return await response.json(); // Assuming you want to parse the response JSON
};



export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};



export const validateToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
      method: "GET", // Ensure you are making a GET request
      credentials: "include", // Include cookies for authentication
    });

    // Check if the response is okay
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Token validation failed");
    }

    // Parse the JSON response
    return response.json();
  } catch (error: any) {
    // Handle the error and provide a message
    throw new Error(
      error.message || "An error occurred during token validation"
    );
  }
};

export const fetchUserDetails=async()=>{
  const response=await fetch(`${API_BASE_URL}/api/auth/user-details`,{
    method:"GET",
    credentials:"include"
  })
  if(!response.ok){
    throw new Error("failed to fetch")
  }
  const user=await response.json();
  return user
}

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/update-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update password");
  }
  return response.json();
};
// Add a new product
export const addProduct = async (productFormData: FormData): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    credentials: "include",
    // headers: {
    //   "Content-Type": "application/json",
    // },

    body: productFormData,
  });
  if (!response.ok) {
    throw new Error("Error adding product");
  }
  const result=await response.json()
  return result
};

// Fetch all products
export const fetchProducts = async (): Promise<ProductType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching products");
  }

  return response.json();
};

// Fetch a single product by ID
export const fetchProductById = async (id: string): Promise<ProductType> => {
  const response = await fetch(
    `${API_BASE_URL}/api/products/edit-product/${id}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching product");
  }

  return response.json();
};

// Update an existing product by ID
export const updateProductById = async (
  productFormData: FormData
): Promise<ProductType> => {
  const response = await fetch(
    `${API_BASE_URL}/api/products/update-product/${productFormData.get("id")}`,
    {
      method: "PUT",
      body: productFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
};
export const deleteProductById = async (id: string): Promise<ProductType> => {
  const response = await fetch(
    `${API_BASE_URL}/api/products/delete-product/${id}`,{
      method:"DELETE",
      credentials:"include"
    }
  );
  if(!response.ok){
    throw new Error("error in deleting")
  }
  return response.json()
};

