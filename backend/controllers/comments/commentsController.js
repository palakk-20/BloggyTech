const asyncHandler = require("express-async-handler");
const Post = require("../../models/Posts/Post");
const Comment = require("../../models/Comments/Comment");
const { Error } = require("mongoose");

//@desc Create new comment
//@route POST : api/v1/users/comments/:postId
//@access private
const createComment = asyncHandler(async (req, res, next) => {
  //Get the payload
  const { message } = req.body;
  const postId = req.params.postId;

  //Create the comment
  const comment = await Comment.create({
    message,
    postId,
    author: req?.userAuth?._id,
  });
  //associate comment with post
  const post = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: comment._id } },
    { new: true },
  );

  res.status(201).json({
    success: true,
    message: "Comment created successfully",
    data: comment,
  });
});

//@desc delete a comment
//@route DELETE : api/v1/users/comments/:id
//@access private
const deleteComment = asyncHandler(async (req, res, next) => {
  const commentId = req.params.commentId;
  await Comment.findByIdAndDelete(commentId);
  res.status(201).json({
    status: "Success",
    message: "Comment successfully deleted",
  });
});

//@desc update a comment
//@route PUT/api/v1/comments/:commentId
//@access private
const updateComment = asyncHandler(async (req, res, next) => {
  const commentId = req.params.commentId;
  const { message } = req.body;
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { message },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(201).json({
    status: "Success",
    message: "Comment successfully updated",
    updatedComment,
  });
});

module.exports = { createComment, deleteComment, updateComment };
