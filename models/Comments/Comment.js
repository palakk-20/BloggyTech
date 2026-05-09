const mongoose = require("mongoose"); //!require("mongoose") returns an object.
const commentSchema = new mongoose.Schema(
  {
    //!mongoose object has a method named Schema
    message: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

//!Coverting schema to model
const Comment = mongoose.model("Comment", commentSchema); //arguments are 1.name which we have to save our model with. 2.schema name which we want to create a model
//mongooose change model name from "Comment" to "comments" in database.
module.exports = Comment;
