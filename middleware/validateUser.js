const { check, validationResult } = require('express-validator');
const User = require('../models/User');

const validateSignup = [
  check('firstName').isAlpha().isLength({ min: 2, max: 30 }),
  check('lastName').isAlpha().isLength({ min: 2, max: 30 }),
  check('email').isEmail().custom(async (email) => {
    const user = await User.findOne({ email });
    if (user) throw new Error('Email already in use');
  }),
  check('mobile').matches(/^[0-9]{10,15}$/).custom(async (mobile) => {
    const user = await User.findOne({ mobile });
    if (user) throw new Error('Mobile already in use');
  }),
  check('password').isStrongPassword(),
  check('confirmPassword').custom((value, { req }) => value === req.body.password),
  check('otp').notEmpty(),
  check('isAgree').equals('true'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

module.exports = { validateSignup };
