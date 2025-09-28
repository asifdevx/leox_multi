
import { AppDispatch } from '@/components/store/store';
import Input from '@/components/ui/Input';
import { changeFee } from '@/reducer/feeSlice';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

const index = () => {
  const dispatch= useDispatch<AppDispatch>();

  const [fee,setFee] =useState<number>(0);

  const changefee = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value;
    setFee(Number(value));             
      
    
  } 
   const handlebtn =()=>{    
    dispatch(changeFee( fee * 10));
  }

  return (
    
      <div className='mt-14 flex w-full items-center justify-center'>
        <Input placeholder={'Change fee'} type={'number'} handleChange={(e)=>changefee(e)} value={fee}/>
          <button type='button' onClick={handlebtn}> click on it </button>
      </div>
  
  )
}

export default index

