import { AppDispatch } from '@/components/store/store';
import { fetchNFT } from '@/reducer/nftSlice';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";

const buy = () => {
const dispatch = useDispatch<AppDispatch>();
  useEffect(()=>{
    dispatch(fetchNFT())
  },[dispatch])
  return (
    <div>
      
    </div>
  )
}

export default buy
