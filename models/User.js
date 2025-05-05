const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 2, maxlength: 30 },
  lastName: { type: String, required: true, minlength: 2, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referralCode: { type: String },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  isMobileVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  isAgree: { type: Boolean, required: true },
  isDelete: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
