

import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Detail = () => {
    const { id } = useParams();

    const { data: product } = useQuery("fetchProductById", () => apiClient.fetchProductById(id as string),
     {
        enabled: !!id
    });

    if (!product) {
        return <></>;
    }

    // Slider settings for react-slick
    const settings = {
        dots: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
    };

    return (
        <div className="container mx-auto px-4 lg:px-8 space-y-4">
            {/* <h1 className="text-3xl font-bold text-center">{product.name}</h1> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Slider */}
                <div className=" w-full h-[500px]">
                    <Slider {...settings}>
                        {product.imageUrls.map((image) => (
                            <div key={image} className="w-full h-[500px]">
                                <img 
                                    src={`${API_BASE_URL}/${image}`} 
                                    alt={product.name} 
                                    className=" rounded-md w-full h-auto object-cover object-center" 
                                />
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* Product Details */}
                <div className="space-y-4 flex flex-col justify-center">
                <h1 className="text-3xl font-bold">{product.name}</h1> 
                    <p className="text-lg whitespace-pre-line">
                        {product.description}
                    </p>

                    <p className="text-2xl font-semibold">
                        Price: Rs{product.price.toFixed(2)}
                    </p>

                    <div>
                        <h3 className="font-bold">Brand:</h3>
                        <p>{product.brand}</p>
                    </div>

                    <div>
                        <h3 className="font-bold">Available Sizes:</h3>
                        <p>{product.sizes.join(", ")}</p>
                    </div>
                    <div>
                        <h3 className="font-bold">Available Colors:</h3>
                        <p>{product.colors.join(", ")}</p>
                    </div>
                <div className="flex justify-center">
                    <button 
                        className="bg-blue-600 text-white 
                         p-2 rounded font-bold hover:bg-blue-500"
                        onClick={() => alert("Added to Cart")}
                    >
                        Add to Cart
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;

