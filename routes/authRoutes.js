const express = require('express');
const router = express.Router();
const { signup, sendOTPHandler } = require('../controllers/authController');
const { validateSignup } = require('../middleware/validateUser');
const { otpLimiter } = require('../middleware/rateLimiter');

router.post('/send-otp', otpLimiter, sendOTPHandler);
router.post('/signup', validateSignup, signup);

module.exports = router;
