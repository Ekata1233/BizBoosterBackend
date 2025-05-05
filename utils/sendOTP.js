// Dummy SMS sender – Replace with real provider
module.exports = async function sendOTP(mobile, otp) {
    console.log(`Sending OTP ${otp} to ${mobile}`);
    // Integrate with SMS API here
  };
  