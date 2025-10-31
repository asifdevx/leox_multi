import React from "react"
import { Slide, toast, ToastContainer, Zoom } from "react-toastify";


const buy = () => {
  const showFancyToast = () => {
    toast.success(
      <div className="flex items-center gap-2">
        <span className="text-lg">🚀</span>
        <span>Deployment Successful!</span>
      </div>,
      {
        position: "top-right",
        autoClose: 1700,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        pauseOnHover: false,
        transition:Slide ,
        progressClassName:
          "!bg-gradient-to-r from-cyan-300 via-cyan-600 to-blue-500",
        className:
          "!bg-white text-black font-medium rounded-xl shadow-lg border border-gray-900",
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
    <button
      onClick={showFancyToast}
      className="px-6 py-3 text-white rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md"
    >
      Show Fancy Toast
    </button>

    <ToastContainer />
  </div>
  )
}

export default buy
