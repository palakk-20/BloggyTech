const User = require("../models/Users/user");
const isAccountVerified = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req?.userAuth?._id);
    //check if user is verified or not
    if (currentUser?.isVerified) {
      next();
    } else {
      res.status(401).json({
        status: "Failed",
        message:
          "Your account is not verified. Please verify your account to access this resource.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "An error occurred while checking account verification status.",
      error: error.message,
    });
  }
};
module.exports = isAccountVerified;
