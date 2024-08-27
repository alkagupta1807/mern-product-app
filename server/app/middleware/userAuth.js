const jwt=require("jsonwebtoken")
const config=require("../config/config")

const userAuthJwt=(req,res,next)=>{
    // if(req.cookies && req.cookies.tokenData){
    //     jwt.verify(req.cookies.tokenData,process.env.JWT_SECRET_KEY,(err,data)=>{
    //         if(!err){
    //             req.user=data;
    //             console.log("userAuthJwt",req.user);
    //             next()
    //         }
    //         else{
    //             console.log("userAuthJwt",err);
    //             next()
                
    //         }
    //     })
    // }
    // else{
    //     console.log("cookie data not found");
    //     next()
    // }
const token=req.cookies["auth_token"] 
if(!token){
    return res.status(401).json({message:"invalid token"})
}
try {
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.user=decoded
    // res.status(200).json({success:true,user:decoded})
    next()
    
} catch (error) {
    return res.status(401).json({message:"unauthorised"})
}
}

module.exports={userAuthJwt}