const express = require("express");
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const Token = require("../model/token.model");
const crypto = require("crypto");
const utils=require("../../../utils/utils")
const randomstring=require("randomstring")
const nodemailer = require("nodemailer");

// Define validation rules
// const validateRegister = [
//   check("firstName", "First Name is required").isString(),
//   check("lastName", "Last Name is required").isString(),
//   check("email", "Valid email is required").isEmail(),
//   check("password", "Password with 6 or more characters required").isLength({
//     min: 6,
//   }),
// ];

// Middleware to handle validation results
// const userValidationHandler = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   next();
// };

const register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const { firstName, lastName, email, password, confirmPassword } = req.body;

   
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    let image = req.file ? req.file.filename : null;
     user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
     
      image: image,
    });

    
    await user.save();

      // Create and save the token
      const tokenModel = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      const token = await tokenModel.save();
  
      // Email credentials
      const senderEmail = "pg5733181@gmail.com";
      const senderPassword = "euhg azio axmd qxba";
  
      // Transporter for nodemailer
      const transporter = utils.transport(senderEmail, senderPassword);
  
      // Email options
      const mailOptions = {
        from: "noreply@raju.com",
        to: user.email,
        subject: "Email Verification",
        text: 
        `Please verify your email: http://localhost:5173/verify-email/${user.email}/${token.token}`,
      };
  
      // Send the email
      await utils.mailSender(req, res, transporter, mailOptions);
  
      // Respond with success message
      return res.status(200).json({ message: 'Registration successful, please check your email for verification.' });
    } catch (error) {
      console.error("Registration error: ", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };
  
  const confirmation = async (req, res) => {
    try {
      // Find the token in the database
      const token = await Token.findOne({ token: req.params.token });
      console.log(token);
      
      if (!token) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      // Find the user based on the token's userId and email
      const user = await User.findOne({
        _id: token.userId,
        email: req.params.email,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the user is already verified
      if (user.isVerified) {
        return res.status(400).json({ message: "User is already verified" });
      }
  
      // Mark the user as verified and save the changes
      user.isVerified = true;
      await user.save();
  
      // Respond with success message
      return res.status(200).json({data:user,token:token, message: "User verified successfully" });
      // return res.redirect('http://localhost:5173/sign-in');  // Adjust to your frontend URL
    } catch (err) {
      console.error("Verification error: ", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

    
// Define validation rules
const validateLogin = [
  check("email", "Email is required").isEmail(),
  check("password", "Password with 6 or more characters required").isLength({
    min: 6,
  }),
];

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000, // 1 day
    });
    res.status(200).json({ _id: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// const validateToken = async (req, res) => {
//   const id=req.body._id;
//   if(id){
//     return res.status(200).json({ _id:id });
//   }
 
// };/
const validateToken = async (req, res) => {
  try {
      const id = req.user?._id; // The _id should be available from req.user set by the middleware
      if (id) {
          return res.status(200).json({ _id: id });
      } else {
          return res.status(404).json({ message: "User ID not found in token" });
      }
  } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
  }
};

const userDetails=async(req,res)=>{
  try {
    const id=req.user?._id;
    const user=await User.findById(id).select("-password")
    if(!user){
      return res.status(404).json({message:"user not found"})
    }
    res.json(user)
    
  } catch (error) {
    res.status(500).json({message:"something went wrong"})
    
  }
}



const logout = async (req, res) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
};




const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    // Ensure password is provided
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    // Get user ID from the authenticated user data
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // Find and update the user's password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPassword = await utils.securePassword(password);
    await User.findByIdAndUpdate(userId, { $set: { password: hashedPassword } });

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const forgetPassword=async(req,res)=>{
  try {
    // Find the user by email
    // const user=await User.findOne({email:req.body.email})
    // console.log(user);
    const {email}=req.body;
    const user=await User.findOne({email})
    

    if(!user){
      return res.status(404).json({message:"User not found"})
    }

    //Generate a unique JWT token for the user that contains the user's id

    // const token=jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY_FOR_RESET,{
    //   expiresIn:"10m"
    // })

    //Generate a reset token
    const resetToken=crypto.randomBytes(32).toString("hex")
    const resetPasswordToken=jwt.sign({resetToken},process.env.JWT_SECRET_KEY_FOR_RESET,{expiresIn:"10m"})
     //save token to user's document in the database
     user.resetPasswordToken=resetPasswordToken;
     await user.save()


    //send the token to the user's email
    const transporter=nodemailer.createTransport({
  //  service:"gmail",
  //  auth:{
  //   user:"pg5733181@gmail.com",
  //   pass:"euhg azio axmd qxba"
  //  }
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "pg5733181@gmail.com",
    pass:"euhg azio axmd qxba" ,
  },
  tls: {
    rejectUnauthorized: false, // This will ignore certificate validation
  },
    })
    // Email configuration
    const mailOptions={
      from: "pg5733181@gmail.com",
      to:user.email,
      subject:"Reset Password",
      html: `<h1>Reset Your Password</h1>
      <p>Click on the following link to reset your password:</p>
      <a href="http://localhost:5173/reset-password/${resetPasswordToken}">http://localhost:5173/reset-password/${resetPasswordToken}</a>
      <p>The link will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>`,
      };
      //send the email
      transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
          return res.status(500).send({message:err.message})
        }
        res.status(200).send({message:"email sent"})
      })
    
    
  } catch (error) {
    res.status(500).send({message:error.message})
  }

}
// const resetPassword=async(req,res)=>{
//   try {
//     //verfify the token sent by the user
//     const  decodedToken=jwt.verify(req.params.token,process.env.JWT_SECRET_KEY)
//     //if the token is invalid return the error
//     if(!decodedToken){
//       return res.status(401).send({message:"invalid token"})
//     } 
//     //find the user with the id from the token
//     const user=await User.findOne({_id:decodedToken.userId})
//     if(!user){
//       return res.status(401).send({message:"no user found"})
//     }
//     //Hash the new password
//     const salt=await bcrypt.genSalt(10)
//     req.body.newPassword=await bcrypt.hash(req.body.newPassword,salt)

//     //update user's password
//     user.password=req.body.newPassword
//     await user.save()
//     console.log("Reset token verified for user:", user.email);
// console.log("New hashed password:", req.body.newPassword);

//     res.status(200).send({message:"Password updated"})

//   } catch (error) {
//     res.status(500).send({message:error.message})
    
//   }


// }
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_FOR_RESET);

    if (!decoded) {
      return res.status(401).send({ message: 'Invalid token' });
    }

    // Find the user
    const user = await User.findOne({resetPasswordToken:token});
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordToken=null
    await user.save();

    res.status(200).send({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};




  

module.exports = {
  // validateRegister,
  // userValidationHandler,
  register,
  // validateLogin,
  login,
  validateToken,
  logout,
  confirmation,
  updatePassword,
  forgetPassword,
  resetPassword,
  userDetails
};
