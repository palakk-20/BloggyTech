const bcrypt = require("bcryptjs");
const User = require("../../models/Users/user");
const generateToken = require("../../util/generateToken");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../util/sendEmail");
const sendVerificationEmail = require("../../util/sendVerificationEmail");
const crypto = require("crypto");

//@desc Register new user
//@route POST : api/v1/users/register
//@access public
const register = asyncHandler(async (req, res, next) => {
  const { username, password, email } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    throw new Error("User alreay exist");
  }
  const newUser = new User({ username, email, password });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  await newUser.save();
  res.json({
    status: "Success",
    message: "User registration successful",
    _id: newUser?.id,
    username: newUser?.username, //!optional chaining i.e. if property exist give value otherwise give undefined but if we dont use optional chaining(?.) we will get an exception if property does not exist
    email: newUser?.email,
    role: newUser?.role,
  });
});

//@desc Login new user
//@route POST : api/v1/users/login
//@access public
const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Invalid credentials");
  }
  let isMatched = await bcrypt.compare(password, user?.password);
  if (!isMatched) {
    throw new Error("Invalid credentials");
  }
  user.lastLogin = new Date();
  await user.save();
  res.json({
    status: "Success",
    email: user?.email,
    id: user?._id,
    username: user?.username,
    role: user?.role,
    token: generateToken(user),
  });
});

//@desc Profile View
//@route GET : api/v1/users/profile/:id
//@access private
const getProfile = asyncHandler(async (req, res, next) => {
  console.log(req.userAuth);

  const user = await User.findById(req.userAuth._id);
  res.json({
    status: "Success",
    messgae: "Profile fetched",
    data: user,
  });
});

//@desc blockuser
//@route PUT : api/v1/users/block/:userIdToBlock
//@access private/admin
const blockUser = asyncHandler(async (req, res, next) => {
  const { userIdToBlock } = req.params;
  const userToBlock = await User.findById(userIdToBlock);
  if (!userToBlock) {
    let error = new Error("User not found");
    next(error);
    return;
  }
  const userBlocking = req.userAuth._id;
  //!check if it is self block
  if (userToBlock.toString() === userBlocking.toString()) {
    let error = new Error("You cannot block yourself");
    next(error);
    return;
  }
  //!get current user object from database
  const currentUser = await User.findById(userBlocking);
  //!check if user is already blocked
  if (currentUser.blockedUsers.includes(userIdToBlock)) {
    let error = new Error("User is already blocked");
    next(error);
    return;
  }
  //!push the user to blockedUsers array of current user
  currentUser.blockedUsers.push(userIdToBlock);
  await currentUser.save();
  res.json({
    status: "Success",
    message: "User blocked successfully",
  });
});

//@desc unblockuser
//@route PUT : api/v1/users/unblock/:userIdToUnblock
//@access private/admin
const unblockUser = asyncHandler(async (req, res, next) => {
  const { userIdToUnblock } = req.params;
  const userToUnblock = await User.findById(userIdToUnblock);
  if (!userToUnblock) {
    let error = new Error("User not found");
    next(error);
    return;
  }
  const userUnblocking = req?.userAuth?._id;
  //!check if it is self unblock
  if (userToUnblock.toString() === userUnblocking.toString()) {
    let error = new Error("You cannot unblock yourself");
    next(error);
    return;
  }
  //!get current user object from database
  const currentUser = await User.findById(userUnblocking);
  //!check if user is not blocked
  if (!currentUser.blockedUsers.includes(userIdToUnblock)) {
    let error = new Error("User is not blocked");
    next(error);
    return;
  }
  //!remove the user from blockedUsers array of current user
  currentUser.blockedUsers.pull(userIdToUnblock);
  await currentUser.save();
  res.json({
    status: "Success",
    message: "User unblocked successfully",
  });
});

//@desc view another user's profile
//@route GET : api/v1/users/view-another-profile/:userProfileId
//@access private
const viewOtherProfile = asyncHandler(async (req, res, next) => {
  //get userId of profile which we want to view from params
  const { userProfileId } = req.params;
  const userProfile = await User.findById(userProfileId);
  if (!userProfile) {
    let error = new Error("User whose profile you want to view is not found");
    next(error);
    return;
  }
  const currentUserId = req?.userAuth?._id;

  //check if the user whose profile we want to view has blocked the current user or not. If that user has blocked the current user then we will not allow current user to view that profile and we will send an error message "You are blocked by this user"
  if (userProfile.blockedUsers.includes(currentUserId)) {
    let error = new Error("You are blocked by this user");
    next(error);
    return;
  }
  //check if we have already viewed the profile or not. If we have already viewed the profile then we will not push the userId to profileViewers array of that userProfile
  if (!userProfile.profileViewers.includes(currentUserId)) {
    userProfile.profileViewers.push(currentUserId);
    await userProfile.save();
  }
  res.json({
    status: "Success",
    message: "Profile viewed successfully",
    // data: userProfile,
  });
});

//@desc follow user
//@route PUT : api/v1/users/follow/:userIdToFollow
//@access private
const followUser = asyncHandler(async (req, res, next) => {
  const currentUser = req?.userAuth?._id;
  const { userIdToFollow } = req.params;
  const userToFollow = await User.findById(userIdToFollow);
  if (!userToFollow) {
    let error = new Error("User not found");
    next(error);
    return;
  }
  //!check if it is self follow
  if (userToFollow.toString() === currentUser.toString()) {
    let error = new Error("You cannot follow yourself");
    next(error);
    return;
  }
  //!push the userId to following array of current user and push the current userId to followers array of userToFollow
  await User.findByIdAndUpdate(
    currentUser,
    { $addToSet: { following: userIdToFollow } },
    { new: true },
  );
  await User.findByIdAndUpdate(
    userIdToFollow,
    { $addToSet: { followers: currentUser } },
    { new: true },
  );
  res.json({
    status: "Success",
    message: "User followed successfully",
  });
});

//@desc unfollow user
//@route PUT : api/v1/users/unfollow/:userIdToUnfollow
//@access private
const unfollowUser = asyncHandler(async (req, res, next) => {
  const currentUser = req?.userAuth?._id;
  const { userIdToUnfollow } = req.params;
  const userToUnfollow = await User.findById(userIdToUnfollow);
  if (!userToUnfollow) {
    let error = new Error("User not found");
    next(error);
    return;
  }
  //!check if it is self unfollow
  if (userToUnfollow.toString() === currentUser.toString()) {
    let error = new Error("You cannot unfollow yourself");
    next(error);
    return;
  }
  //!check if user is already not followed
  const currentUserObj = await User.findById(currentUser);
  if (!currentUserObj.following.includes(userIdToUnfollow)) {
    let error = new Error("You are not following this user");
    next(error);
    return;
  }
  //!pull the userId from following array of current user and pull the current userId from followers array of userToUnfollow
  await User.findByIdAndUpdate(
    currentUser,
    { $pull: { following: userIdToUnfollow } },
    { new: true },
  );
  await User.findByIdAndUpdate(
    userIdToUnfollow,
    { $pull: { followers: currentUser } },
    { new: true },
  );

  res.json({
    status: "Success",
    message: "User unfollowed successfully",
  });
});

//@desc forgot password
//@route PUT : api/v1/users/forgot-password
//@access public
const forgotPassword = asyncHandler(async (req, res, next) => {
  //!fetch email from req.body
  const { email } = req.body;
  //!find email in database
  const userFound = await User.findOne({ email });
  if (!userFound) {
    let error = new Error("email is not registered");
    next(error);
    return;
  }
  //!get reset token from userFound object by calling generatePasswordResetToken method and save userFound object to database
  const resetToken = await userFound.generatePasswordResetToken();
  await userFound.save();
  await sendEmail(userFound.email, resetToken);
  res.json({
    status: "Success",
    message: "Password reset token sent to your email",
  });
});

//@desc reset password
//@route PUT : api/v1/users/reset-password/:resetToken
//@access public
const resetPassword = asyncHandler(async (req, res, next) => {
  //!get token from params
  const { resetToken } = req.params;
  //!get new password from req.body
  const { newPassword } = req.body;
  //!convert resetToken to hashed token by using crypto module because in database we are storing hashed token
  console.log("resetToken", resetToken);
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log("hashedToken", hashedToken);
  //verify token with DB
  const userFound = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!userFound) {
    let error = new Error("Invalid or expired token");
    next(error);
    return;
  }
  //update password of userFound with newPassword and also reset passwordResetToken and passwordResetExpires fields and save the userFound object to database
  const salt = await bcrypt.genSalt(10);
  userFound.password = await bcrypt.hash(newPassword, salt);
  userFound.passwordResetToken = undefined;
  userFound.passwordResetExpires = undefined;
  await userFound.save();
  res.json({
    status: "Success",
    message: "Password reset successful",
  });
});

//@desc send account verification mail
//@route PUT : api/v1/users/account-verification-email
//@access private
const accountVerificationEmail = asyncHandler(async (req, res, next) => {
  //!find current user's email from database by using userAuth._id which we are getting from isLoggedIn middleware and then call generateAccountVerificationToken method to generate account verification token and then save that token to database and then send that token to user's email by using sendVerificationEmail function which we have created in util/sendVerificationEmail.js file.
  const currentUserId = req?.userAuth?._id;
  const currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    let error = new Error("User not found");
    next(error);
    return;
  }
  const verifyToken = currentUser.generateAccountVerificationToken();
  await currentUser.save();
  await sendVerificationEmail(currentUser.email, verifyToken);
  res.json({
    status: "Success",
    message: `Account verification email sent to your email ${currentUser.email}`,
  });
});

module.exports = {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  followUser,
  unfollowUser,
  viewOtherProfile,
  forgotPassword,
  resetPassword,
  accountVerificationEmail,
};
