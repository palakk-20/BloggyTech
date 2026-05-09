const express = require("express");
const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  viewOtherProfile,
  followUser,
  unfollowUser,
} = require("../../controllers/users/usersController");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const usersRouter = express.Router();
usersRouter.post("/register", register);
usersRouter.post("/login", login);

usersRouter.get("/profile", isLoggedIn, getProfile);

usersRouter.put("/block/:userIdToBlock", isLoggedIn, blockUser);
usersRouter.put("/unblock/:userIdToUnblock", isLoggedIn, unblockUser);

usersRouter.get(
  "/view-other-profile/:userProfileId",
  isLoggedIn,
  viewOtherProfile,
);

usersRouter.put("/follow/:userIdToFollow", isLoggedIn, followUser);
usersRouter.put("/unfollow/:userIdToUnfollow", isLoggedIn, unfollowUser);

module.exports = usersRouter;
