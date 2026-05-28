const jwt = require("jsonwebtoken");
const User = require("../models/Users/user");
const dotenv = require("dotenv");
dotenv.config();

const isLoggedIn = (req, res, next) => {
  //fetch token from request
  const token = req.headers.authorization?.split(" ")[1];
  //verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    //if not, send err msg
    if (err) {
      const error = new Error(err?.message);
      next(error);
    }
    //if successfull then, then pass user object to next path
    else {
      const userId = decoded?.user?.id;
      const user = await User.findById(userId).select(
        "username email role _id",
      );
      req.userAuth = user;
      next();
    }
  });
};
module.exports = isLoggedIn;
