

import { useFormContext } from "react-hook-form";

import { ProductFormData } from "./ManageProductForm";
import { productBrand } from "../../config/products-options-config";

const BrandSection = () => {
  const { register, watch,formState:{errors} } = useFormContext<ProductFormData>();
  const brandWatch = watch("brand");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Brand</h2>
      <div className="grid grid-cols-5 gap-2">
        {productBrand.map((brand) => (
          <label
            className={
              brandWatch === brand
                ? "cursor-pointer bg-blue-300 text-sm rounded-full px-4 py-2 font-semibold"
                : "cursor-pointer bg-gray-300 text-sm rounded-full px-4 py-2 font-semibold"
            }
          >
            <input
              type="radio"
              value={brand}
              {...register("brand", { required: "This field is required" })}
             className="hidden"/>
            <span>{brand}</span>
          </label>
        ))}
      </div>
      {errors.brand && (<span className="text-red-500 text-sm font-bold">{errors.brand.message}</span>)}
    </div>
  );
};
export default BrandSection;
