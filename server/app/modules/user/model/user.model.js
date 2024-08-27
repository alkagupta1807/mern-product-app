const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User schema definition
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  type: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken:{
    type:String
  }
});

// Hash password before saving the user
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 8);
//   }
//   next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
