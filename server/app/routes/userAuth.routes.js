const express=require("express")
const { register, login, validateToken, logout, confirmation, updatePassword, forgetPassword,
     resetPassword, userDetails} = require("../modules/webService/userApiController")

const upload = require("../helper/registerImage")
const { checkEmail } = require("../middleware/checkEmail")
const { userAuthJwt } = require("../middleware/userAuth")
const router=express.Router()

router.post("/register",upload.single("image"),register)
router.post("/login",login)
router.get("/validate-token",userAuthJwt,validateToken)
router.get("/user-details",userAuthJwt,userDetails)
router.get("/verify-email/:email/:token",confirmation)
router.post("/update-password",userAuthJwt,updatePassword)
router.post("/logout",logout)
router.post("/forget-password",forgetPassword)
router.post("/reset-password/:token",resetPassword)

module.exports=router