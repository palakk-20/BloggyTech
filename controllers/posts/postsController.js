const asyncHandler = require("express-async-handler");

const Post = require("../../models/Posts/Post");
const Category = require("../../models/Categories/Category");
const User = require("../../models/Users/user");
const { Error } = require("mongoose");

//@desc Create new post
//@route POST : api/v1/users/posts
//@access private
const createPost = asyncHandler(async (req, res, next) => {
  //Get the payload
  const { title, content, categoryId } = req.body;

  //check is post is present
  const postFound = await Post.findOne({ title });
  if (postFound) {
    let error = new Error("Post already exist");
    return next(error);
  }

  //create post object
  const post = await Post.create({
    title,
    content,
    category: categoryId,
    author: req?.userAuth?._id,
  });

  //update category by adding post in it.
  const catg = await User.findByIdAndUpdate(
    req?.userAuth?._id,
    { $push: { posts: post._id } },
    { new: true },
  );

  //update user by adding post in it.
  const user = await User.findByIdAndUpdate(
    categoryId,
    { $push: { posts: post._id } },
    { new: true },
  );

  //send the response.
  res.json({
    status: "Success",
    message: "Post successfully created.",
    post,
    user,
    catg,
  });
});

//@desc Get all posts
//@route GET/api/v1/posts/
//@access public
const getPosts = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({});
  res.status(201).json({
    status: "Success",
    message: "All posts successfully fetched",
    allPosts,
  });
});

//@desc Get single posts
//@route GET/api/v1/posts/:id
//@access public
const getSinglePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not found!");
    next(error);
  }
  res.status(200).json({
    status: "Success",
    message: "Post fetched successfully.",
    post,
  });
});

//@desc delete a post
//@route DELETE/api/v1/posts/:id
//@access private
const deletePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  await Post.findByIdAndDelete(postId);
  res.status(201).json({
    status: "Success",
    message: "Post successfully deleted",
  });
});

//@desc update a post
//@route PUT/api/v1/posts/:id
//@access private
const updatePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  const post = req.body;
  const updatedPost = await Post.findByIdAndUpdate(postId, post, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: "Success",
    message: "Post successfully updated",
    updatedPost,
  });
});

//@desc Like a post
//@route PUT /api/v1/posts/like/:postId
//@access private
const likePost = asyncHandler(async (req, res, next) => {
  //!get id of post from params
  const { postId } = req.params;
  //!get current user
  const currentUserId = req.userAuth._id;
  //!search the post
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not found");
    next(error);
    return;
  }
  //!Add the current userid to likes array
  await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { likes: currentUserId } },
    { new: true },
  );
  //!remove current userid from dislikes array
  post.dislikes = post.dislikes.filter(
    (userId) => userId.toString() != currentUserId.toString(),
  );
  //!resave post
  await post.save();
  res.json({
    status: "Success",
    message: "Post liked successfully",
  });
});

module.exports = {
  createPost,
  getPosts,
  getSinglePost,
  deletePost,
  updatePost,
  likePost,
};
