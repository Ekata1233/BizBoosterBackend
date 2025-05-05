const bcrypt = require('bcryptjs');

module.exports = async function hashOTP(otp) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(otp, salt);
};
