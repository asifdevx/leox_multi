import React, { useEffect, useMemo } from 'react'
import { ProfilePageProps } from '@/types'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';


const OwnedPage =  ({username}:ProfilePageProps) => {
  const profile =useSelector((s:RootState)=>s.userProfile.cache[username||""]);

  const {user,nfts}=profile;
  const {name,address} = user;
  const isMyProfile = useMemo(() => !name, [name]);
    
    
  
  return (
    <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">
      {isMyProfile ? "My Owned NFTs" : `${name}'s Owned NFTs`}
    </h1>
    {/* shared grid/list component here */}
  </div>
  )
}

export default OwnedPage