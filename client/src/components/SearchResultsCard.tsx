import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export type ProductType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  sizes: string[];
  colors: string[];
  imageFiles: FileList;
  imageUrls: string[];
};

type Props = {
  product: ProductType;
};

const SearchResultsCard = ({ product }: Props) => {
  const queryClient = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  console.log(selectedProductId); 

  const mutation = useMutation(
    (id: string) => apiClient.deleteProductById(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("fetchProducts"); // Refetch products
        setSelectedProductId(null); // Clear the selected product ID
      },
      onError: (error: Error) => {
        console.error("Error deleting product:", error);
      },
    }
  );

  

  const handleDelete = (id: string) => {
     toast.info("Are you sure you want to delete this product?", {
      position: "top-center",
      autoClose: false,
      closeOnClick: true,
      onClose: () => {
        setSelectedProductId(id); // Set the selected product ID
        mutation.mutate(id);
      },
    });

   
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <div className="flex flex-col">
       
        <div className="relative w-full  h-64 overflow-hidden mb-4">
          {product.imageUrls && product.imageUrls.length > 0 && (
            <img
              src={`${API_BASE_URL}/uploads/${product.imageUrls[0]}`}
              alt={product.name}
              className=" absolute inset-0 w-full h-auto object-cover object-center rounded-lg"
            />
          )}
        </div>
        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
       

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border border-gray-300 rounded-sm p-2 flex items-center">
            <span className="font-medium">Brand:</span>{" "}
            <span className="ml-1">{product.brand}</span>
          </div>
          <div className="border border-gray-300 rounded-sm p-2 flex items-center">
            <span className="font-medium">Colors:</span>{" "}
            <span className="ml-1">{product.colors.join(", ")}</span>
          </div>
          <div className="border border-gray-300 rounded-sm p-2 flex items-center">
            <span className="font-medium">Sizes:</span>{" "}
            <span className="ml-1">{product.sizes.join(", ")}</span>
          </div>
          <div className="border border-gray-300 rounded-sm p-2 flex items-center">
            <span className="font-medium">Price:</span>{" "}
            <span className="ml-1">Rs{product.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Link
            to={`/edit-product/${product._id}`}
            className="bg-yellow-500 text-white text-sm font-bold py-2 px-4 rounded hover:bg-yellow-400 transition duration-300"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(product._id)}
            className="bg-red-600 text-white text-sm font-bold py-2 px-4 rounded hover:bg-red-500 transition duration-300"
          >
            Delete
          </button>
          <Link
            to={`/detail/${product._id}`}
            className="bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded hover:bg-blue-500 transition duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;
