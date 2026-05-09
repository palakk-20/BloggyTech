const express = require("express");
const {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../../controllers/categories/categoriesController");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const categoriesRouter = express.Router();

//!create category.
categoriesRouter.post("/", isLoggedIn, createCategory);

//!fetch all categoriesss.
categoriesRouter.get("/", getCategory);

//!delete single category
categoriesRouter.delete("/:id", isLoggedIn, deleteCategory);

//!update single category
categoriesRouter.put("/:id", isLoggedIn, updateCategory);

module.exports = categoriesRouter;
