const User = require("../modules/user/model/user.model")

const checkEmail=async(req,res,next)=>{

    try {
        const data=await User.findOne({email:req.body.email})
    if(data){
        return res.status(400).json({message:"Email already exists"})
    }
    // const {firstName,email,password,confirmPassword}=req.body
    // if(!(firstName && email && password && confirmPassword)){
    //       return res.status(400).json({message:"All inputs are required"})
    // }
    // if(password!==confirmPassword){
    //     return res.status(400).json({message:"Password do not match"})
    // }
    next()

        
    } catch (error) {

        return res.status(500).json({message:error.message})
    }

}
module.exports={checkEmail}