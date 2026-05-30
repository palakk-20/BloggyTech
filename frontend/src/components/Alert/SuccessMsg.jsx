import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetSuccessAction } from "../../redux/slices/globalSlice/globalSlice";
const SuccessMsg = ({ message }) => {
  const dispatch = useDispatch();
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
  });
  dispatch(resetSuccessAction());
};

export default SuccessMsg;
