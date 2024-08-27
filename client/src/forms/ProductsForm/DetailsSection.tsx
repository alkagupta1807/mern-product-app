import { useFormContext } from "react-hook-form";
import { ProductFormData } from "./ManageProductForm";

const ProductDetailsSection = () => {
    const { register, formState: { errors } } = useFormContext<ProductFormData>();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-3">
                Add Product
            </h1>
            <label  className="text-gray-700 text-sm font-bold flex-1">
                Name
                <input
                    type="text"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("name", { required: "This field is required" })}
                />
                {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                )}
            </label>
        
            <label className="text-gray-700 text-sm font-bold flex-1">
                Description
                <textarea
                    rows={10}
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("description", { required: "This field is required" })}
                />
                {errors.description && (
                    <span className="text-red-500">{errors.description.message}</span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold max-w-[50%]">
                Price
                <input
                    type="number"
                    min={1}
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("price", { required: "This field is required" })}
                />
                {errors.price && (
                    <span className="text-red-500">{errors.price.message}</span>
                )}
            </label>
          
        </div>
    );
};

export default ProductDetailsSection;
