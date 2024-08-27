import { useMutation } from "react-query";
import ManageProductForm from "../forms/ProductsForm/ManageProductForm";
import * as apiClient from "../api-client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(apiClient.addProduct,{
    onSuccess: () => {
      toast.success("Product Saved!");
      navigate("/my-products");
    },
    onError: () => {
        
    },

  }
 
  );

  const handleSave = (productFormData: FormData) => {
    mutate(productFormData);
  };

  return <ManageProductForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddProduct;





