import { toast } from "react-toastify";

export const showToast = (
  textContent,
  options = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  }
) => {
  toast(textContent, options);
};
