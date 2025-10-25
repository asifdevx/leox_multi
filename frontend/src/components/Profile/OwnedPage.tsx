import CheckIsMyProfile from '@/utils/CheckIsMyProfile'
import React, { useEffect, useMemo } from 'react'

const OwnedPage = ({username}:{username?:string}) => {
  const isMyProfile = CheckIsMyProfile(username!)
  return (
    <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">
      {isMyProfile ? "My Owned NFTs" : `${username}'s Owned NFTs`}
    </h1>
    {/* shared grid/list component here */}
  </div>
  )
}

export default OwnedPage