import React, { useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAction } from "../../redux/slices/categories/categorySlices";
import {
  addPostAction,
  updatePostAction,
} from "../../redux/slices/posts/postSlices";
import { useEffect } from "react";
import Swal from "sweetalert2";
import LoadingComponent from "../Alert/LoadingComponent";
import ErrorMsg from "../Alert/ErrorMsg";
import SuccessMsg from "../Alert/SuccessMsg";
import { resetErrorAction } from "../../redux/slices/globalSlice/globalSlice";
import { resetSuccessAction } from "../../redux/slices/globalSlice/globalSlice";
import { useParams } from "react-router-dom";
const UpdatePost = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});

  const { post, error, loading, success } = useSelector(
    (state) => state?.posts,
  );
  const { categories } = useSelector((state) => state?.categories);
  // console.log(categories);
  const options = categories?.allcategories?.map((category) => {
    return { value: category?._id, label: category?.name };
  });
  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    title: "",
    image: null,
    category: null,
    content: "",
  });

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, category: selectedOption.value });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Success Alert
  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Post Updated Successfully",
        confirmButtonColor: "#0f172a",
      });

      dispatch(resetSuccessAction());
    }
  }, [success, dispatch]);

  // const handleFileChange = (e) => {
  //   setFormData({ ...formData, image: e.target.files[0] });
  // };

  const handleSubmit = (e) => {
    console.log(formData);
    e.preventDefault();
    dispatch(updatePostAction({ ...formData, postId }));
    setFormData({
      title: "",
      image: null,
      category: null,
      content: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full lg:w-1/2">
        <div className="flex flex-col items-center p-10 xl:px-24 xl:pb-12 bg-white lg:max-w-xl lg:ml-auto rounded-4xl shadow-2xl">
          <h2 className="mb-4 text-2xl md:text-3xl text-coolGray-900 font-bold text-center">
            Update Your Post
          </h2>
          {error && <ErrorMsg message={error?.message} />}
          {/* {success && <SuccessMsg message="Post Updated Successfully" />} */}

          <h3 className="mb-7 text-base md:text-lg text-coolGray-500 font-medium text-center">
            Share your thoughts and ideas with the community
          </h3>
          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Title</span>
            <input
              className="py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
              type="text"
              placeholder="Enter the post title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {/* error here */}
            {errors?.title && (
              <p className="text-red-500 text-sm">{errors?.title}</p>
            )}
          </label>
          {/* <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Image</span>
            <input
              className="py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
              type="file"
              name="image"
              onChange={handleFileChange}
              onBlur={handleBlur}
            />
            {errors?.image && (
              <p className="text-red-500 text-sm">{errors?.image}</p>
            )}
          </label> */}
          {/* category here */}
          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Category</span>
            <Select
              options={options}
              name="category"
              onChange={handleSelectChange}
              placeholder="Select a category"
            />
            {/* error here */}
            {errors?.category && (
              <p className="text-red-500 text-sm">{errors?.category}</p>
            )}
          </label>
          {/* <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Content</span>
            <textarea
              className="py-3 px-3 leading-5 w-full text-coolGray-400 font-normal border border-coolGray-200 outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-lg shadow-sm"
              placeholder="Write your post content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors?.content && (
              <p className="text-red-500 text-sm">{errors?.content}</p>
            )}
          </label> */}
          {loading ? (
            <LoadingComponent />
          ) : (
            <button
              className="mb-4 inline-block py-3 px-7 w-full leading-6 text-green-50 font-medium text-center bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md"
              type="submit"
            >
              Update
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdatePost;
