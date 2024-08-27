

import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import FilterSection from "../components/FilterSection";
import SearchBar from "../components/SearchBar";

import SearchResultsCard from "../components/SearchResultsCard";
import { Link } from "react-router-dom";

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
        imageFiles:FileList
    };

    interface Filters{
        // name:string,
        // brands:string[],
        brands:string[],
        colors:string[],
        sizes:string[],
        // page:number

    }
 





const AllProducts = () => {
    const [filters, setFilters] = useState<Filters>({
      brands: [],
      // brands:"",
      sizes: [],
      colors: [],
    });
  
    const [products, setProducts] = useState<ProductType[]>([]); // To store filtered products
    const [searchedProducts, setSearchedProducts] = useState<ProductType[] | null>(null); // To store searched products
  
    // Fetch filtered products based on filters
    const fetchFilteredProducts = async (filters: Filters): Promise<ProductType[]> => {
      const params = new URLSearchParams();
  
      if (filters.brands.length) params.append('brands', filters.brands.join(','));
      
      if (filters.colors.length) params.append('colors', filters.colors.join(','));
      if (filters.sizes.length) params.append('sizes', filters.sizes.join(','));
  
      const response = await fetch(`${API_BASE_URL}/api/products/filter?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      return response.json();
    };
  
    const { data, isLoading, error,refetch } = useQuery<ProductType[], Error>(
      ["fetchProducts", filters],
      () => fetchFilteredProducts(filters),
      
      {  
     
        onSuccess: (fetchedProducts) => {
          setProducts(fetchedProducts);
        },
      }
    );
    console.log(data);
    
    useEffect(() => {
      refetch();
    }, [filters, refetch]);  // Refetch data when filters change
  
    // Handle search results
    const handleSearchResults = (searchResults: ProductType[]) => {
      setSearchedProducts(searchResults); // Update searched products
    };
  
   // Handle filter changes
    const handleBrandsChange = (brands: string[]) => {
      setFilters((prevFilters) => ({ ...prevFilters, brands }));
      setSearchedProducts(null); // Reset search results when filters change
    };

    
  
    const handleColorsChange = (colors: string[]) => {
      setFilters((prevFilters) => ({ ...prevFilters, colors }));
      setSearchedProducts(null); // Reset search results when filters change
    };
  
    const handleSizesChange = (sizes: string[]) => {
      setFilters((prevFilters) => ({ ...prevFilters, sizes }));
      setSearchedProducts(null); // Reset search results when filters change
    };
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;
  
    // Determine which data set to display: searchedProducts or products
    const productsToDisplay = searchedProducts !== null ? searchedProducts : products;
  
    return (
      <div className="p-2 md:p-1 lg:p-1">
        <div className="flex justify-between items-center mb-4">
          {!productsToDisplay || productsToDisplay.length === 0 ? (
            <span>No products found</span>
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold">My Products</h1>
          )}
  
          <Link
            to="/add-product"
            className="bg-blue-600 text-white text-base md:text-lg lg:text-xl font-bold p-2 hover:bg-blue-500 rounded"
          >
            Add Product
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/4">
            <FilterSection
              filters={filters}
              onBrandsChange={handleBrandsChange}
              onColorsChange={handleColorsChange}
              onSizesChange={handleSizesChange}
            />
          </div>
          <div className="w-full lg:w-3/4">
            <SearchBar onSearchResults={handleSearchResults} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {productsToDisplay.map((product: ProductType) => (
                <SearchResultsCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AllProducts;
  
  
  
  
