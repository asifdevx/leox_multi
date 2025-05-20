import { InputProps } from "@/types";
import React from "react";

const Input = ({
  placeholder,
  type,
  inputClass,
  iconClass,
  position,
  icon,
  value,
  handleChange
}: InputProps) => {
  return (
    <div className="relative w-full">
      <input
        placeholder={placeholder}
        type={type}
        className={`${inputClass} xl:placeholder:text-[15px] placeholder:text-[13px] outline-none p-2`}
        onChange={handleChange}
        onWheel={(e) => e.currentTarget.blur()}
        value={value}
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

export default Input;
