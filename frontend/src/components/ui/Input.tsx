import { InputProps } from "@/types";
import { cn } from "@/utils/cn";
import React from "react";

const Input = ({
  placeholder,
  type,
  inputClass,
  iconClass,
  position,
  icon,
  value,
  handleChange,
  onFocus,
  onBlur
}: InputProps) => {
  return (
    <div className="relative w-full">
      <input
        placeholder={placeholder}
        type={type}
        className={cn("xl:placeholder:text-[15px] placeholder:text-[13px] outline-none p-2",inputClass)}
        onChange={handleChange}
        onWheel={(e) => e.currentTarget.blur()}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur} 
       
      />
      {icon && (
        <div
          className={`absolute ${iconClass} ${
            position === "left" ? "left-3 top-1/2 -translate-y-1/2" : "right-3 top-1/2 -translate-y-1/2"
          }`}
        >
          {icon}
        </div>
      )}
    </div>
  );
};

export default React.memo(Input);
