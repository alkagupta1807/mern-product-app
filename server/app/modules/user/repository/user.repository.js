const Token = require("../model/token.model")
const User = require("../model/user.model")

const findUserByEmail=async(email)=>{
   return await User.findOne({email})
}

const saveUser=async(userData)=>{
    const user=new User(userData)
    return await user.save()

}

const createToken=async(userId)=>{
    const token=new Token({
        userId,
        token:crypto.randomBytes(16).toString("hex")
    })
    return await token.save()
}

const findToken = async (token) => {
    return await Token.findOne({ token });
};

const findUserByIdAndEmail = async (userId, email) => {
    return await User.findOne({ _id: userId, email });
};
const findUserById = async (id) => {
    return await User.findById(id);
};

const updateUserPassword = async (userId, hashedPassword) => {
    return await User.findByIdAndUpdate(userId, { $set: { password: hashedPassword } });
  };

  const saveResetToken = async (user, resetPasswordToken) => {
    user.resetPasswordToken = resetPasswordToken;
    await user.save();
  };

  const findUserByResetToken = async (token) => {
    return await User.findOne({ resetPasswordToken: token });
  };
  
  const updatePasswordAndClearToken = async (user, hashedPassword) => {
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    await user.save();
  };



module.exports={findUserByEmail,saveUser,createToken,findToken,
    findUserByIdAndEmail,findUserById,updateUserPassword,
    saveResetToken,findUserByResetToken,updatePasswordAndClearToken}