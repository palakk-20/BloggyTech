import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetSuccessAction } from "../../redux/slices/globalSlice/globalSlice";
import { useEffect } from "react";
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
