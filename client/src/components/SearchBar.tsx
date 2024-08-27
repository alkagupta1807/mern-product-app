

import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type ProductType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  colors: string[];
  sizes: string[];
  imageUrls: string[];
  imageFiles: FileList;
};

interface SearchBarProps {
  onSearchResults: (searchResults: ProductType[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (searchValue) params.append('name', searchValue);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/filter?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const products: ProductType[] = await response.json();
      onSearchResults(products); // Send the search results back to the parent component
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder="Search products..."
          className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
