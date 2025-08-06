import { toast, Bounce } from 'react-toastify';

const ShowToast = (success , message) => {
  if (success == true) {
    toast(`✅ ${message}` || 'Task Successful', {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      closeButton:false,
    });
  } else {
    toast.warn(message, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    closeButton:false,
    theme: "light",
    transition: Bounce,
    });
  }
};

export default ShowToast;
