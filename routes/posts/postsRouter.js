const express = require("express");
const {
  createPost,
  getPosts,
  getSinglePost,
  deletePost,
  updatePost,
} = require("../../controllers/posts/postsController");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const postsRouter = express.Router();

//!create post.
postsRouter.post("/", isLoggedIn, createPost);

//!fetch all postss.
postsRouter.get("/", getPosts);

//!fetch single post.
postsRouter.get("/:id", getSinglePost);

//!delete single post
postsRouter.delete("/:id", isLoggedIn, deletePost);

//!update single category
postsRouter.put("/:id", isLoggedIn, updatePost);

module.exports = postsRouter;
