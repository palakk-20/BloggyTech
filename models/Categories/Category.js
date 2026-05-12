const mongoose = require("mongoose"); //!require("mongoose") returns an object.
const categorySchema = new mongoose.Schema(
  {
    //!mongoose object has a method named Schema
    name: {
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
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
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

const Category = mongoose.model("Category", categorySchema); //arguments are 1.name which we have to save our model with. 2.schema name which we want to create a model
//mongooose change model name from "Category" to "categorys" in database.
module.exports = Category;
