// hooks/useToast.tsx
import { toast, Slide, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

const baseConfig: ToastOptions = {
  position: "top-right",
  autoClose: 1700,
  hideProgressBar: false,
  pauseOnHover: true,
  closeOnClick: true,
  draggable: true,
  transition: Slide,
  progressClassName: "!bg-gradient-to-r from-cyan-300 via-cyan-600 to-blue-500",
  className:
    "!bg-white text-black font-medium rounded-xl shadow-lg border border-gray-100",
};

// helper: toast message with icon
const withIcon = (Icon: React.ElementType, message: string, color: string) => (
  <div className="flex items-center gap-2">
    <Icon className={`w-5 h-5 ${color}`} strokeWidth={2.3} />
    <span>{message}</span>
  </div>
);

export const useToast = () => {
  const success = (msg: string) =>
    toast.success(withIcon(CheckCircle2, msg, "text-green-500"), baseConfig);

  const error = (msg: string) =>
    toast.error(withIcon(XCircle, msg, "text-red-500"), baseConfig);

  const info = (msg: string) =>
    toast.info(withIcon(Info, msg, "text-blue-500"), baseConfig);

  const warning = (msg: string) =>
    toast.warning(withIcon(AlertTriangle, msg, "text-yellow-500"), baseConfig);

  return { success, error, info, warning };
};
