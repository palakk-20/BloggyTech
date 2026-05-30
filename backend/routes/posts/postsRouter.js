const express = require("express");
const multer = require("multer");
const storage = require("../../util/fileUpload");

const {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  updatePost,
  likePost,
  dislikePost,
  clapPost,
  schedulePost,
  getPublicPosts,
} = require("../../controllers/posts/postsController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const isAccountVerified = require("../../middlewares/isAccountVerified");
const postsRouter = express.Router();
const upload = multer({ storage: storage });

//!create post.
postsRouter.post(
  "/",
  isLoggedIn,
  isAccountVerified,
  upload.single("file"),
  createPost,
);

//!fetch all postss.
postsRouter.get("/", isLoggedIn, getAllPosts);

//!get only 4 posts
postsRouter.get("/public", getPublicPosts);

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

//!schedule a post
postsRouter.put("/schedule/:postId", isLoggedIn, schedulePost);

module.exports = postsRouter;
