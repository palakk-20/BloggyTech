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
  post: null,
  posts: [],
};

//Fetch public posts action
export const fetchPublicPostAction = createAsyncThunk(
  "posts/fetch-public-post",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    //make request
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/posts/public",
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

//Fetch private posts action
export const fetchPrivatePostAction = createAsyncThunk(
  "posts/fetch-private-post",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    //make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/posts",
        config,
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

//fetch single post action
export const getPostAction = createAsyncThunk(
  "posts/get-post",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    //make request
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/posts/${postId}`,
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

//Create post action
export const addPostAction = createAsyncThunk(
  "posts/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    //make request
    try {
      //convert payload to form data
      const formData = new FormData();
      formData.append("title", payload?.title);
      formData.append("file", payload?.image);
      formData.append("categoryId", payload?.category);
      formData.append("content", payload?.content);

      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:3000/api/v1/posts",
        formData,
        config,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

//Delete post slice
export const deletePostAction = createAsyncThunk(
  "posts/delete-post",
  async (postId, { rejectWithValue, getState, dispatch }) => {
    //make request
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // console.log("delete controller run");
      const { data } = await axios.delete(
        `http://localhost:3000/api/v1/posts/${postId}`,
        config,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

//update post slice
// export const updatePostAction = createAsyncThunk(
//   "post/update",
//   async (payload, { rejectWithValue, getState, dispatch }) => {
//     try {
//       //convert the payload to formdata
//       const formData = new FormData();
//       formData.append("title", payload?.title);
//       // formData.append("content", payload?.content);
//       formData.append("categoryId", payload?.category);
//       // formData.append("file", payload?.image);

//       const token = getState().users?.userAuth?.userInfo?.token;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const { data } = await axios.put(
//         `http://localhost:3000/api/v1/posts/${payload?.postId}`,
//         formData,
//         config,
//       );
//       return data;
//     } catch (error) {
//       return rejectWithValue(error?.response?.data);
//     }
//   },
// );
// updatePostAction
export const updatePostAction = createAsyncThunk(
  "post/update",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:3000/api/v1/posts/${payload?.postId}`,
        {
          title: payload.title,
          category: payload.category,
        },
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Posts slice
const postsSlice = createSlice({
  name: "posts",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    //!fetch public posts actions
    builder.addCase(fetchPublicPostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchPublicPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = true;
      state.posts = action.payload;
    });
    builder.addCase(fetchPublicPostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    //!fetch private post
    builder.addCase(fetchPrivatePostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchPrivatePostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = true;
      state.posts = action.payload;
    });
    builder.addCase(fetchPrivatePostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    //!fetch single post
    builder.addCase(getPostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // state.success = true;
      state.post = action.payload;
    });
    builder.addCase(getPostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    //!create post actions
    builder.addCase(addPostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.post = action.payload;
    });
    builder.addCase(addPostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    //!delete post actions
    builder.addCase(deletePostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deletePostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
    });
    builder.addCase(deletePostAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    //! update post
    builder.addCase(updatePostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updatePostAction.fulfilled, (state, action) => {
      state.post = action.payload;
      state.success = true;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updatePostAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    //!reset error action
    builder.addCase(resetErrorAction, (state, action) => {
      state.error = null;
    });

    //!reset success action
    builder.addCase(resetSuccessAction, (state, action) => {
      state.success = false;
    });
  },
});

const postsReducer = postsSlice.reducer;
export default postsReducer;
