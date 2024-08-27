import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client"
import ManageProductForm from "../forms/ProductsForm/ManageProductForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



const EditProduct=()=>{
    const {id}=useParams();
    const navigate = useNavigate();

    const {data:product}=useQuery("fetchMyProductById",()=>
    apiClient.fetchProductById(id || ''),{
        enabled:!!id,
       
    })

    const {mutate,isLoading}=useMutation(apiClient.updateProductById,{
        onSuccess: () => {
            toast.success("Product Saved!");
            navigate("/my-products");
          },
    })

    const handleSave=(productFormData:FormData)=>{
        mutate(productFormData)
    }
    return <ManageProductForm product={product} onSave={handleSave} isLoading={isLoading} />

}
export default EditProduct