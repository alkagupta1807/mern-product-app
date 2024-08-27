const path=require("path");
const fs=require("fs")
const {
   updateById,findProductById,saveProduct,findProductsByQuery,
   saveProductData,
   getAll,
   getById} =require("../products/repository/product.repository")


const createProduct=async(req,res)=>{
   try {
    const {name,description,brand,colors,sizes,price}=req.body;
    const imageFiles=req.files;
    const imageUrls=imageFiles?imageFiles.map((file)=>file.filename):null

    const productData={
      name,
      description,
      brand,
      sizes,
      colors,
      price,
      imageUrls
    }
    const product=await saveProductData(productData);
    res.status(201).json({product})
    
   } catch (error) {
    res.status(500).json({ message: "Error creating product" });
   } 
}

const getAllProducts=async(req,res)=>{
   try {
      const products=await getAll();
      res.json(products)
   } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
   }
}
const getProductById=async(req,res)=>{
   try {
      const id=req.params.id;
      const product=await getById(id);
      if(!product){
         return res.status(404).json({message:"Product not found"})
      }
      res.json(product)
      
   } catch (error) {
      res.status(500).json({ message: "Error fetching product" });  
   }
}

const updateProductById=async(req,res)=>{
try {
   const id=req.params.id;
   const updatedProductData=req.body;
   const imageFiles=req.files;
   //fetch the product before updating to get the current image urls
   let product=await getById(id)
   if(!product){
      return res.status(404).json({ message: "Product not found" });
   }

   const currentImageUrls=product.imageUrls || [];
   //handle new image files if provided
   const updatedImageUrls=imageFiles?imageFiles.map((file)=>file.filename):[]

      // Delete old images that are no longer in the updated product imageUrls
      const imagesToDelete = currentImageUrls.filter(url => !updatedProductData.imageUrls?.includes(url));
      imagesToDelete.forEach(image => {
          const imagePath = path.join(__dirname, "../", "../", "../", "uploads", image);
          if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
          }
      });
       // Update product fields excluding imageUrls and save
       product = await updateById(id,
          { ...updatedProductData, imageUrls: [...updatedImageUrls, ...(updatedProductData.imageUrls || [])] });

       res.status(201).json(product);

   
} catch (error) {
   res.status(500).json({ message: "Something went wrong" });
}


}

const deleteProductById=async(req,res)=>{
   try {
      const id=req.params.id;

        // Find the product by ID
        const product = await findProductById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

         // Delete images from the filesystem
         if (product.imageUrls && product.imageUrls.length > 0) {
            product.imageUrls.forEach(image => {
                const imagePath = path.join(__dirname, "../", "../", "../", "uploads", image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        // Mark the product as deleted by setting deletedAt
        product.deletedAt = new Date();
        await saveProduct(product);

        res.status(200).json({ message: "Product deleted successfully", product });

   } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Something went wrong" });
      
   }
}
const filter = async (req, res) => {
   try {
      
       let constructedQuery = { deletedAt: null }; // Add condition to check for soft-deleted products
       
       if (req.query.name) {
           constructedQuery.name = new RegExp(req.query.name, "i");
       }

       if (req.query.brands) {
           const brandsArray = req.query.brands.split(',').map((brand) => brand.trim());
           constructedQuery.brand = { $in: brandsArray };
       }

       if (req.query.colors) {
           const colorsArray = req.query.colors.split(',').map((color) => color.trim());
           constructedQuery.colors = { $in: colorsArray };
       }

       if (req.query.sizes) {
           const sizesArray = req.query.sizes.split(',').map((size) => size.trim());
           constructedQuery.sizes = { $in: sizesArray };
       }

       
       const products = await findProductsByQuery(constructedQuery);

       
       res.json(products);
   } catch (error) {
       console.error("Error filtering products:", error);
       res.status(500).json({ message: "Something went wrong" });
   }
};


module.exports=
{createProduct,getAllProducts,getProductById,updateProductById,deleteProductById,filter}
