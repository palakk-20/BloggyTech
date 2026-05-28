const express = require("express");
const {
  createComment,
  deleteComment,
  updateComment,
} = require("../../controllers/comments/commentsController");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const commentsRouter = express.Router();

//!create comment.
commentsRouter.post("/:postId", isLoggedIn, createComment);

//!delete single comment
commentsRouter.delete("/:commentId", isLoggedIn, deleteComment);

//!update single comment
commentsRouter.put("/:commentId", isLoggedIn, updateComment);

module.exports = commentsRouter;
