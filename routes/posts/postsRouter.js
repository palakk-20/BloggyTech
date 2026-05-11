const express = require("express");
const {
  createPost,
  getPosts,
  getSinglePost,
  deletePost,
  updatePost,
  likePost,
  dislikePost,
  clapPost,
} = require("../../controllers/posts/postsController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const isAccountVerified = require("../../middlewares/isAccountVerified");

const postsRouter = express.Router();

//!create post.
postsRouter.post("/", isLoggedIn, isAccountVerified, createPost);

//!fetch all postss.
postsRouter.get("/", getPosts);

//!fetch single post.
postsRouter.get("/:id", getSinglePost);

//!delete single post
postsRouter.delete("/:id", isLoggedIn, deletePost);

//!update single category
postsRouter.put("/:id", isLoggedIn, updatePost);

//!like a post
postsRouter.put("/like/:postId", isLoggedIn, likePost);

//!dislike a post
postsRouter.put("/dislike/:postId", isLoggedIn, dislikePost);

//!clap a post
postsRouter.put("/claps/:postId", isLoggedIn, clapPost);

module.exports = postsRouter;
