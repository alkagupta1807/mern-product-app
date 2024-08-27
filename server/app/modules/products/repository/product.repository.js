const Product = require("../model/product.model")

const saveProductData=async(productData)=>{
    const product=new Product(productData);
    return await product.save()
}
const getAll=async()=>{
    return await Product.find({deletedAt:null})
}

const getById=async(id)=>{
    return await Product.findOne({_id:id})
}
const updateById=async(id,updateData)=>{
    return await Product.findByIdAndUpdate(id,updateData,{new:true})

}

const findProductById=async(id)=>{
    return await Product.findById(id)

}
const saveProduct=async(product)=>{
  return await product.save()
}


const findProductsByQuery = async (query) => {
    return await Product.find(query).exec();
};




module.exports={saveProductData,getAll,getById,
    updateById,findProductById,saveProduct,findProductsByQuery}