const mongoose = require('mongoose')

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 300   // 5 phút
    }
  },
  {timestamps: true}
);

const forgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgotPassword");
module.exports = forgotPassword;