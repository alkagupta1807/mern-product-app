

import { FormProvider, useForm } from "react-hook-form";
import ProductDetailsSection from "./DetailsSection";
import { useEffect } from "react";
import BrandSection from "./BrandSection";
import ColorSection from "./ColorSection";
import SizeSection from "./SizeSection";
import ImagesSection from "./ImagesSection";

export type ProductType = {
    _id: string,
    name: string,
    description: string,
    brand: string,
    price: number,
    colors: string[],
    sizes: string[],
    imageFiles: FileList,
    imageUrls: string[],
}

export type ProductFormData = {
    name: string,
    description: string,
    brand: string,
    price: number,
    colors: string[],
    sizes: string[],
    imageFiles: FileList,
    imageUrls: string[],
}

type Props = {
    product?: ProductType,
    onSave: (productFormData: FormData) => void,
    isLoading: boolean
}

const ManageProductForm = ({ onSave, isLoading, product }: Props) => {
    const formMethods = useForm<ProductFormData>();

    const { handleSubmit, reset } = formMethods;

    useEffect(() => {
        reset(product);
    }, [product, reset]);

    const onSubmit = handleSubmit((formDataJson: ProductFormData) => {
        const formData = new FormData();
        if (product) {
            formData.append("id", product._id);
        }
        formData.append("name", formDataJson.name);
        formData.append("description", formDataJson.description);
        formData.append("price", formDataJson.price.toString());
      
        formData.append("brand",formDataJson.brand)
        formDataJson.colors.forEach((color, index) => {
            formData.append(`colors[${index}]`, color);
        });
        formDataJson.sizes.forEach((size, index) => {
            formData.append(`sizes[${index}]`, size);
        });
        if (formDataJson.imageUrls) {
            formDataJson.imageUrls.forEach((url, index) => {
                formData.append(`imageUrls[${index}]`, url);
            });
        }
        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile);
        });
        console.log(formDataJson);
        onSave(formData);
    });

    return (
        <div className="flex justify-center items-center">
            <FormProvider {...formMethods}>
                <form className="flex flex-col gap-10 bg-white p-8 rounded shadow-lg w-full max-w-3xl" onSubmit={onSubmit} encType="multipart/form-data">
                    <ProductDetailsSection />
                    <BrandSection />
                    <ColorSection />
                    <SizeSection />
                    <ImagesSection />
                    <span className="flex justify-end">
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </span>
                </form>
            </FormProvider>
        </div>
    );
}

export default ManageProductForm;

