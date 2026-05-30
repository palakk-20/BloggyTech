import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../redux/slices/users/userSlices";
import postsReducer from "../redux/slices/posts/postSlices";
import categoriesReducer from "../redux/slices/categories/categorySlices";
const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    categories: categoriesReducer,
  },
});
export default store;
