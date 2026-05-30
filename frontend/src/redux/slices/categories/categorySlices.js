import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  resetErrorAction,
  resetSuccessAction,
} from "../globalSlice/globalSlice";
//Initial State
const INITIAL_STATE = {
  loading: false,
  error: null,
  success: false,
  category: null,
  categories: [],
};

//Fetch categories action
export const fetchCategoriesAction = createAsyncThunk(
  "categories/lists",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    //make request
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/categories",
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

//Categories slice
const categoriesSlice = createSlice({
  name: "categories",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    //fetch categories actions
    builder.addCase(fetchCategoriesAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });
  },
});

const categoriesReducer = categoriesSlice.reducer;
export default categoriesReducer;
