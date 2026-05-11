const mongoose = require("mongoose"); //!require("mongoose") returns an object.
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    //!mongoose object has a method named Schema
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"], //only two options for role
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountLevel: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    notificationType: {
      email: { type: String },
    },
    gender: {
      type: String,
      enum: ["male", "female", "prefer not to say", "non-binary"],
    },

    //properties that deal with relationship. Like we connect table through foreign key

    profileViewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //one user will have many profile viewers so we have array for profile viewers and type of object is "Users"
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    accountVerificationToken: { type: String },
    accountVerificationExpires: { type: Date },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.generateAccountVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.accountVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return verificationToken;
};

//!Coverting schema to model

const User = mongoose.model("User", userSchema); //arguments are 1.name which we have to save our model with. 2.schema name which we want to create a model
//mongooose change model name from "User" to "users" in database.
module.exports = User;
