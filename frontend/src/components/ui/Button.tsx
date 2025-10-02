import { customBtnProps } from "@/types";
import { cn } from "@/utils/cn";
import React from "react";

const Button = ({ loading, handleClick, title, othercss }: customBtnProps) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "font-semibold text-white bg-gradient-to-r from-[#00ff95d0] to-[#00d1ff] shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all disabled:opacity-50",
        othercss
      )}
    >
      {title}
    </button>
  );
};

export default Button;
