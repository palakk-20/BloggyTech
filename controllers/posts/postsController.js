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
//@access private
const getAllPosts = asyncHandler(async (req, res, next) => {
  const currentUserId = req?.userAuth?._id;
  //!get all those users who have blocked the current user
  const usersBlockingCurrentUser = await User.find({
    blockedUsers: currentUserId,
  }).select("_id");
  //!Extract ids of the users who have blocked the current user
  const usersBlockingCurrentUserIds = usersBlockingCurrentUser.map(
    (userObj) => userObj._id,
  );
  //!get current datetime
  const currentDateTime = new Date();
  const query = {
    author: { $nin: usersBlockingCurrentUserIds },
    $or: [
      { scheduledPublished: { $lte: currentDateTime } },
      { scheduledPublished: null },
    ],
  };

  //!fetch all posts whose author is not in usersBlockingCurrentUserIds array
  const allPosts = await Post.find(query);
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

//@desc dislike a post
//@route PUT /api/v1/posts/dislike/:postId
//@access private
const dislikePost = asyncHandler(async (req, res, next) => {
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
  //!Add the current userid to dislikes array
  await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { dislikes: currentUserId } },
    { new: true },
  );
  //!remove current userid from likes array
  post.likes = post.likes.filter(
    (userId) => userId.toString() != currentUserId.toString(),
  );
  //!resave post
  await post.save();
  res.json({
    status: "Success",
    message: "Post disliked successfully",
  });
});

//@desc clap a post
//@route PUT /api/v1/posts/claps/:postId
//@access private
const clapPost = asyncHandler(async (req, res, next) => {
  //!get id of post from params
  const { postId } = req.params;
  //!search the post
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not found");
    next(error);
    return;
  }
  //!increment claps by 1
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $inc: { claps: 1 } },
    { new: true },
  );

  res.json({
    status: "Success",
    message: "Post clapped successfully",
    updatedPost,
  });
});

//@desc Schedule a post
//@route PUT /api/v1/posts/schedule/:postId
//@access private
const schedulePost = asyncHandler(async (req, res, next) => {
  //!get the data from params and body
  const { postId } = req.params;
  const { scheduledAt } = req.body;
  //!check if post is present and scheduledPublished date is present in body
  if (!scheduledAt || !postId) {
    let error = new Error("Invalid request data");
    next(error);
    return;
  }
  //!Search post in a db
  const post = await Post.findById(postId);
  if (!post) {
    let error = new Error("Post not found");
    next(error);
    return;
  }
  //!check if current user is author of the post
  if (post.author.toString() !== req.userAuth._id.toString()) {
    let error = new Error("You are not authorized to schedule this post");
    next(error);
    return;
  }
  //!check if requested scheduled publish date is in future and not in past
  const scheduledDate = new Date(scheduledAt); //converting string to date
  const currentDate = new Date();
  if (scheduledDate <= currentDate) {
    let error = new Error("Scheduled publish date must be in the future");
    next(error);
    return;
  }
  post.scheduledPublished = scheduledDate;
  await post.save();
  const updatedPost = await Post.findById(postId);
  res.json({
    status: "Success",
    message: "Post scheduled successfully at " + scheduledDate.toISOString(),
    updatedPost,
  });
});

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  updatePost,
  likePost,
  dislikePost,
  clapPost,
  schedulePost,
};
