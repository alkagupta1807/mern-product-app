const multer=require("multer")
const path=require("path")
const fs=require("fs")

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
  
        const uploadPath=path.join(__dirname,"../","../","uploads")
  
        //check if directory exists,if not the create it
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath)
        }
        cb(null,uploadPath)
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname)
    }
  })
  
  const fileFilter=(req,file,cb)=>{
    if(file.mimetype==="image/png" || file.mimetype==="image/jpg" || file.mimetype==="image/jpeg"){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
  }
   const upload=multer({
    storage,
    fileFilter,
    limits:{
        fileSize:1024*1024*100
    }
  })
  module.exports=upload