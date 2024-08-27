const crypto=require("crypto");
const bcrypt=require('bcryptjs')
const jwt = require("jsonwebtoken");
const utils=require("../../utils/utils");
const { findUserByEmail, saveUser, createToken,
   findToken, findUserByIdAndEmail, updateUserPassword,
    findUserById, saveResetToken, findUserByResetToken, updatePasswordAndClearToken } 
    = require("../user/repository/user.repository");


const register = async (req, res) => {
    try {
        // Check if user already exists
        let user = await findUserByEmail(req.body.email);

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const { firstName, lastName, email, password } = req.body;

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user object
        let image = req.file ? req.file.filename : null;
        user = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            image,
        };

        // Save the user
        const savedUser = await saveUser(user);

        // Create and save the token
        const token = await createToken(savedUser._id);

        // Email credentials
        const senderEmail = "pg5733181@gmail.com";
        const senderPassword = "euhg azio axmd qxba";

        // Transporter for nodemailer
        const transporter = utils.transport(senderEmail, senderPassword);

        // Email options
        const mailOptions = {
            from: "noreply@raju.com",
            to: savedUser.email,
            subject: "Email Verification",
            text: `Please verify your email: http://localhost:5173/verify-email/${savedUser.email}/${token.token}`,
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
        const token = await findToken(req.params.token);
        console.log(token);

        if (!token) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Find the user based on the token's userId and email
        const user = await findUserByIdAndEmail(token.userId, req.params.email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
           // Check if the user is already verified
        if (user.isVerified) {
        return res.status(400).json({ message: "User is already verified" });
      }

        // Mark the user as verified and save the changes
        user.isVerified = true;
        await saveUser(user);

        // Respond with success message
        return res.status(200).json({ data: user, token: token, message: "User verified successfully" });
    } catch (err) {
        console.error("Verification error: ", err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email using the repository
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });

        // Set the JWT token in the cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000, // 1 day
        });

        // Respond with the user ID
        res.status(200).json({ _id: user._id });
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const validateToken = async (req, res) => {
    try {
        const id = req.user?._id; // The _id should be available from req.user set by the middleware
        
        if (id) {
            const user = await findUserById(id);
            if (user) {
                return res.status(200).json({ _id: user._id });
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        } else {
            return res.status(404).json({ message: "User ID not found in token" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const userDetails = async (req, res) => {
    try {
        const id = req.user?._id;
        const user = await findUserById(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
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
  
      // Find the user
      const user = await findUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Hash the new password
      const hashedPassword = await utils.securePassword(password);
  
      // Update the user's password
      await updateUserPassword(userId, hashedPassword);
  
      return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  const forgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find the user by email
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetPasswordToken = jwt.sign(
        { resetToken },
        process.env.JWT_SECRET_KEY_FOR_RESET,
        { expiresIn: "10m" }
      );
  
      // Save token to user's document in the database
      await saveResetToken(user, resetPasswordToken);
  
      // Set up the email transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: "pg5733181@gmail.com",
          pass: "euhg azio axmd qxba",
        },
        tls: {
          rejectUnauthorized: false, // This will ignore certificate validation
        },
      });
  
      // Email configuration
      const mailOptions = {
        from: "pg5733181@gmail.com",
        to: user.email,
        subject: "Reset Password",
        html: `<h1>Reset Your Password</h1>
               <p>Click on the following link to reset your password:</p>
               <a href="http://localhost:5173/reset-password/${resetPasswordToken}">http://localhost:5173/reset-password/${resetPasswordToken}</a>
               <p>The link will expire in 10 minutes.</p>
               <p>If you didn't request a password reset, please ignore this email.</p>`,
      };
  
      // Send the email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        res.status(200).send({ message: "Email sent" });
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_FOR_RESET);
  
      if (!decoded) {
        return res.status(401).send({ message: "Invalid token" });
      }
  
      // Find the user by reset token
      const user = await findUserByResetToken(token);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Update the user's password and clear the reset token
      await updatePasswordAndClearToken(user, hashedPassword);
  
      res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  
module.exports={register,confirmation,login,validateToken,userDetails,logout,
    updatePassword,forgetPassword,resetPassword}
