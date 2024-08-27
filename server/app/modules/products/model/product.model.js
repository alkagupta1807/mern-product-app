const mongoose=require("mongoose")

const productSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
   price: {
    type: Number,
    required: true,
  },
  colors: {
    type: [String],
    required: true,
  },
  sizes: {
    type: [String],
    required: true,
  },
  imageUrls: {
    type: [String],
    required: true,
  },
  
  deletedAt:{
    type:Date,
    default:null
  }
 
 
});

const Product = mongoose.model("Product", productSchema);

module.exports=Product
