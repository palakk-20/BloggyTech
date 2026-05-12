const Category = require("../../models/Categories/Category");
const asyncHandler = require("express-async-handler");

//@desc Create new category
//@route POST/api/v1/categories/
//@access private

const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const isCategoryPresent = await Category.findOne({ name });
  if (isCategoryPresent) {
    throw new Error("Category already existing.");
  }
  const category = await Category.create({
    name: name,
    author: req?.userAuth._id,
  });
  res.json({
    status: "Success",
    message: "Category created successfully.",
    category,
  });
});

//@desc Get new category
//@route GET/api/v1/categories/
//@access public
const getCategory = asyncHandler(async (req, res, next) => {
  const allcategories = await Category.find({}).populate({
    path: "posts",
    model: "Post",
    select: "title content author",
  });
  res.status(201).json({
    status: "Success",
    message: "All catergories successfully fetched",
    allcategories,
  });
});

//@desc delete a category
//@route DELETE/api/v1/categories/:id
//@access private
const deleteCategory = asyncHandler(async (req, res, next) => {
  const catId = req.params.id;
  await Category.findByIdAndDelete(catId);
  res.status(201).json({
    status: "Success",
    message: "Catergory successfully deleted",
  });
});

//@desc update a category
//@route PUT/api/v1/categories/:id
//@access private
const updateCategory = asyncHandler(async (req, res, next) => {
  const catId = req.params.id;
  const name = req.body.name;
  const updatedCategory = await Category.findByIdAndUpdate(
    catId,
    { name: name },
    { new: true, runValidators: true },
  );
  res.status(201).json({
    status: "Success",
    message: "Catergory successfully updated",
    updatedCategory,
  });
});

module.exports = {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
};
