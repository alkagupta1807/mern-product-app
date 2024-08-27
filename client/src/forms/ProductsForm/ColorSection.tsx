import { useFormContext } from "react-hook-form"
import {  productColor } from "../../config/products-options-config"

import { ProductFormData } from "./ManageProductForm"


const ColorSection=()=>{
    const {register,formState:{errors}}=useFormContext<ProductFormData>()

    return(
        <div>
            <h2 className="text-2xl font-bold mb-3">Colors</h2>
            <div className="grid grid-cols-5 gap-3">
                {productColor.map((color,index)=>
                    (
                        <label  key={index} className="text-sm flex gap-1 text-gray-700">
                            <input type="checkbox" value={color} {...register("colors",{
                                validate:(colors)=>{
             if(colors && colors.length>0){
                return true
             }else{
                return "At least one brand is required"
             }
                                }
                            })}
                            />
                            {color}
                        </label>

                    ))}
            </div>
            {errors.colors && (
                <span className="text-red-500 text-sm font-bold">
                    {errors.colors.message}
                </span>
            )}
        </div>
    )
}
export default ColorSection