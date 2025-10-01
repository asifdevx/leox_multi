import { customBtnProps } from '@/types';
import React from 'react'

const Button = ({loading,handleClick,title,othercss}:customBtnProps) => {
  return (
    <button
    type="button"
    onClick={handleClick}
    disabled={loading}
    className={`font-semibold text-white 
    bg-gradient-to-r from-[#00ff95] to-[#00d1ff] 
    shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all 
    disabled:opacity-50 ${othercss}`}
  >
    {title}
  </button>
  )
}

export default Button;