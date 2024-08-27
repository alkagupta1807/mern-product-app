const nodemailer = require("nodemailer");
const bcrypt=require("bcryptjs")

const transport = (senderEmail, password) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: senderEmail,
      pass: password,
    },
    tls: {
      rejectUnauthorized: false, // This will ignore certificate validation
    },
  });
  return transporter;
};

// const mailSender = (req, res, trans, mailOptions) => {
//   trans.sendMail(mailOptions, (err) => {
//     if (err) {
//      return res.status(500).json({ message: "Technical issue", success: false });
//     } else {
//    return   res.status(200).json({
//         message:
//           "A Verification Email Sent To Your Mail ID....Please Verify By Clicking The Link.... It Will Expire In 24 Hrs...",
//         success: true,
//       });
//     }
//   });
// };
const mailSender = async (req, res, transporter, mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error); // Reject the promise with an error
      } else {
        console.log("Email sent: " + info.response);
        resolve(info); // Resolve the promise with the email info
      }
    });
  });
};

const securePassword=(password)=>{
  const salt=bcrypt.genSaltSync(10);
  const hashPassword=bcrypt.hashSync(password,salt)
  return hashPassword
}

module.exports = {
  transport,
  mailSender,
  securePassword
};
