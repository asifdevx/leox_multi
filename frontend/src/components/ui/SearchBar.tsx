import { SearchBarProps } from '@/types'
import React from 'react'
import Input from './Input'
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

const SearchBar = ({search,setSearchBar}:SearchBarProps) => {
  return (
    <div className='fixed top-0 left-0 w-full z-50 px-12 flex '>
      <Input placeholder={'Search your nFts'} type={'text'} inputClass="w-full" icon={<HiOutlineMagnifyingGlass/>}/>
    <button onClick={()=>setSearchBar(!search)}>close</button>
    </div>
  )
}

export default SearchBar
