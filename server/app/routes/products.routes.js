const express=require("express")
const router=express.Router()
const { userAuthJwt } = require("../middleware/userAuth")



const uploadProduct=require("../helper/uploadProduct");
const { createProduct, getAllProducts, getProductById,
      updateProductById, filter, deleteProductById } = 
      require("../modules/webService/productApiController");



router.post("/",userAuthJwt,uploadProduct.array("imageFiles",6),createProduct)
router.get("/",userAuthJwt,getAllProducts)
router.get("/edit-product/:id",userAuthJwt,getProductById)
router.put("/update-product/:id",userAuthJwt,uploadProduct.array("imageFiles",6),updateProductById)
router.get("/filter",userAuthJwt,filter)

router.delete("/delete-product/:id",userAuthJwt,deleteProductById)
module.exports=router