const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const hashOTP = require('../utils/hashOTP');
const sendOTP = require('../utils/sendOTP');

exports.signup = async (req, res) => {
  try {
    const {
      firstName, lastName, email, mobile, password,
      referralCode, otp, isAgree
    } = req.body;

    const existingUser = await User.findOne({ mobile });
    if (!existingUser || !existingUser.otp || !existingUser.otpExpiresAt) {
      return res.status(400).json({ message: 'No OTP found. Request OTP first.' });
    }

    const isValidOTP = await bcrypt.compare(otp, existingUser.otp);
    const isExpired = new Date() > existingUser.otpExpiresAt;
    if (!isValidOTP || isExpired) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName, lastName, email, mobile,
      password: hashedPassword,
      isMobileVerified: true,
      isAgree,
      isDelete: false
    });

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        newUser.referredBy = referrer._id;
      } else {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.sendOTPHandler = async (req, res) => {
  try {
    const { mobile } = req.body;
    const otp = generateOTP();
    const hashed = await hashOTP(otp);
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ mobile });
    if (!user) {
      user = new User({ mobile });
    }
    user.otp = hashed;
    user.otpExpiresAt = expires;
    await user.save();

    await sendOTP(mobile, otp);

    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};
