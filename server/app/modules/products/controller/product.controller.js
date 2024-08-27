const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { body, param, validationResult } = require("express-validator");

const Product = require("../model/product.model");

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../", "../","../","../", "uploads");

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadProduct = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 100
    }
});

// Define validation rules
const validateForm = [
    body("name").notEmpty().withMessage("Name is required"),
   
    body("description").notEmpty().withMessage("Description is required"),
    body("brands").notEmpty().withMessage("Brand is required"),
    body("price").notEmpty().isNumeric().withMessage("Price is required and must be a number"),
    body("colors").notEmpty().isArray().withMessage("Colors are required"),
    body("sizes").notEmpty().isArray().withMessage("Sizes are required")
];

// Middleware to handle validation results
const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};



const createProduct = async (req, res) => {
    try {
        const { name, description, brand, colors, sizes, price } = req.body;
        const imageFiles = req.files;

        const imageUrls = imageFiles ? imageFiles.map(file => file.filename) : null;

        const product = new Product({
            name,
            description,
            brand,
            colors,
            sizes,
            price,
            imageUrls
        });

        await product.save();

        res.status(201).json({ product });
    } catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ deletedAt:null });
        return res.json(products);
    } catch (error) {
        res.send({ message: "Error fetching products" });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({
            _id: id,
            
        });
        return res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product" });
    }
};

// Update product by ID
const updateProductById = async (req, res) => {

try{
    let id=req.params.id
    const updatedProduct=req.body;
    console.log(updatedProduct);

    //fetch the product before updating to get the current image urls
    let product=await Product.findById(id);
    if(!product){
        return res.json({message:"Producct not found"})
    }

    const currentImageUrls=product.imageUrls || [];

    //update the product field excluding imageUrls
    product=await Product.findByIdAndUpdate(id,{...updatedProduct},{new:true})

    //handle new image files if provided
    const imageFiles=req.files
    const updatedImageUrls=imageFiles?.map(file=>(file.filename)) || []

    //delete old images that are no longer in the updated product imageurls
    const imagesToDelete=currentImageUrls.filter(url=>!updatedProduct.imageUrls?.includes(url))

    imagesToDelete.forEach(image => {
        const imagePath = path.join(__dirname, "../", "../","../","../", "uploads", image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    });

    // Merge new and existing image URLs
    product.imageUrls = [...updatedImageUrls, ...(updatedProduct.imageUrls || [])];
    await product.save();

    res.status(201).json(product);
    

}
catch(error){
    res.status(500).json({message:"something went wrong"})
}


}

const deleteProductById=async(req,res)=>{
    try {
        const id=req.params.id;
        const product=await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

         //delete the image from the filesystem
         if(product.imageUrls && product.imageUrls.length>0){
            product.imageUrls.forEach(image=>{
                const imagePath=path.join(__dirname,"../","../","../","../","uploads",image)
                if(fs.existsSync(imagePath)){
                    fs.unlinkSync(imagePath)
                }
            })

         }
         
        //set the deletedAt field to the current timestamp
       
        product.deletedAt = new Date();
        //save the product with the updated deletedAt field
        await product.save()
        res.status(200).json({message:"product deleted successfully",product})

       
        
    } catch (error) {
        console.error("Error deleting product:", error); 
        res.status(500).json({message:"something went wrong"})  
    }

}


const filter=async(req,res)=>{
    try {

        const constructSearchQuery=(queryParams)=>{
           
            let constructedQuery = { deletedAt: null }; // Add condition to check for soft-deleted products
            if(queryParams.name){
                constructedQuery.name=
                    new RegExp(queryParams.name,"i")
                
            }
            
              
                 if(queryParams.brands){
                    //handle multiple brands
                    const brandsArray=queryParams.brands.split(',').map((brand)=>brand.trim())
                    constructedQuery.brand={
                        $in:brandsArray
                    }
                 }
              
                  
                 if(queryParams.colors){
                    const colorsArray=queryParams.colors.split(',').map((color)=>color.trim())
                    constructedQuery.colors={
                        $in:colorsArray
                    }
                 }
                 if(queryParams.sizes){
                    const sizesArray=queryParams.sizes.split(',').map((size)=>size.trim())
                    constructedQuery.sizes={
                        $in:sizesArray
                    }
                 }
  return constructedQuery
        }
        const query=constructSearchQuery(req.query)
        const products=await Product.find(query).exec()

      
        res.json(products)
    } catch (error) {
        console.error("Error deleting product:", error); // Log the error
        res.status(500).json({message:"something went wrong"})  
    }
}




module.exports = {
    uploadProduct,
    validateForm,
    validationHandler,
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    filter,
    deleteProductById
};
