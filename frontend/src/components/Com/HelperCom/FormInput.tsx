import Input from '@/components/ui/Input';
import { FormInputProps } from '@/types';
import { cn } from '@/utils/cn';
import React from 'react'



const FormInput: React.FC<FormInputProps> = ({
    label,
    placeholder,
    type = "text",
    value,
    icon,
    inputClass = "",
    error,
    onChange,
    onFocus,
    onBlur

  }) => {
    return (
      <div className="w-full flex flex-col gap-2">
        <label>{label}</label>
        <Input
          placeholder={placeholder}
          type={type}
          value={value}
          inputClass={cn("w-full px-4 py-3 rounded-lg  bg-[#0f1f33] border border-[#1e3350] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00d1ff]/50 focus:border-[#00d1ff] transition xl:placeholder:text-[15px] placeholder:text-[13px] outline-none p-2 rounded-lg",inputClass)}
          icon={icon}
          handleChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
         {error && <p className="text-red-400 text-xs mt-1">{error}</p>} {/* ✅ */}
      </div>
    );
  };
export default React.memo(FormInput)