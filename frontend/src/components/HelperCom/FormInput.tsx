import { FormInputProps } from '@/types';
import React from 'react'
import Input from '../ui/Input';


const FormInput: React.FC<FormInputProps> = ({
    label,
    placeholder,
    type = "text",
    value,
    icon,
    inputClass = "",
    onChange,
  }) => {
    return (
      <div className="w-full flex flex-col gap-2">
        <label>{label}</label>
        <Input
          placeholder={placeholder}
          type={type}
          value={value}
          inputClass={`w-full bg-[#e8eeee] rounded-lg ${inputClass}`}
          icon={icon}
          handleChange={onChange}
        />
      </div>
    );
  };
export default FormInput