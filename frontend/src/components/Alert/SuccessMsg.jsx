import React from "react";
import Swal from "sweetalert2";
const SuccessMsg = ({ message }) => {
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
  });
};

export default SuccessMsg;
