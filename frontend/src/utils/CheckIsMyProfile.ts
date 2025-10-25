import React, { useEffect, useMemo } from 'react'

const CheckIsMyProfile = (username:string) => {
    const isMyProfile = useMemo(() => !username, [username]);
  
    useEffect(() => {
      if (isMyProfile) {
        console.log("Fetching MY NFTs...");
        // fetch NFTs for connected wallet
      } else {
        console.log(`Fetching NFTs for seller: ${username}`);
        // fetch NFTs for this username
      }
    }, [isMyProfile, username]);
    return isMyProfile
}

export default CheckIsMyProfile