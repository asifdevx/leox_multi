import { customBtnProps } from "@/types";
import { cn } from "@/utils/cn";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Button: React.FC<customBtnProps> = ({
  loading = false,
  handleClick,
  title,
  othercss = "",
  icon: Icon,
  iconClass = "",
}) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "px-4 py-2 font-semibold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-[#00ff95d0] to-[#00d1ff] rounded-lg shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        othercss
      )}
    >   
    {loading && <AiOutlineLoading3Quarters className="text-black animate-spin"/>}
     {title}
          {Icon && <span className={iconClass}> {Icon}</span>}

    </button>
  );
};

export default Button;