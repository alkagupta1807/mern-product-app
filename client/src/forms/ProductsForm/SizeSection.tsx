import { useFormContext } from "react-hook-form"
import {  productSize } from "../../config/products-options-config"

import { ProductFormData } from "./ManageProductForm"


const SizeSection=()=>{
    const {register,formState:{errors}}=useFormContext<ProductFormData>()

    return(
        <div>
            <h2 className="text-2xl font-bold mb-3">Sizes</h2>
            <div className="grid grid-cols-5 gap-3">
                {productSize.map((size,index)=>
                    (
                        <label  key={index}className="text-sm flex gap-1 text-gray-700">
                            <input type="checkbox" value={size} {...register("sizes",{
                                validate:(sizes)=>{
             if(sizes && sizes.length>0){
                return true
             }else{
                return "At least one brand is required"
             }
                                }
                            })}
                            />
                            {size}
                        </label>

                    ))}
            </div>
            {errors.sizes && (
                <span className="text-red-500 text-sm font-bold">
                    {errors.sizes.message}
                </span>
            )}
        </div>
    )
}
export default SizeSection