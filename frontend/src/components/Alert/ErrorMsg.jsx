import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
const ErrorMsg = ({ message }) => {
  const dispatch = useDispatch();
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
  dispatch(resetErrorAction());
};

export default ErrorMsg;
