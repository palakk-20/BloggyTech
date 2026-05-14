const mongoose = require("mongoose"); //!require("mongoose") returns an object.
const postSchema = new mongoose.Schema(
  {
    //!mongoose object has a method named Schema
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    claps: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shares: {
      type: Number,
      default: 0,
    },
    postViews: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    scheduledPublished: {
      type: Date,
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//!Coverting schema to model

const Post = mongoose.model("Post", postSchema); //arguments are 1.name which we have to save our model with. 2.schema name which we want to create a model
//mongooose change model name from "Post" to "posts" in database.
module.exports = Post;
