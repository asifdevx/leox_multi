// ProfileLayout.tsx
import React, { useEffect } from 'react';
import Header from '@/components/Header';

import { AppDispatch, RootState } from '@/components/store/store';
import { getUserProfile } from '@/reducer/userProfile';
import { useDispatch, useSelector } from 'react-redux';
import ItemsBanner from '@/components/Com/itemsComponents/ItemsBanner';
import ProfileNav from '@/components/Com/HelperCom/ProfileNav';

interface ProfileLayoutProps {
  username: string;
  children:  React.ReactNode;
}

const ProfileLayout = ({ username, children }: ProfileLayoutProps) => {

  const dispatch = useDispatch<AppDispatch>();
  const { cache, loading } = useSelector((s: RootState) => s.userProfile);

  const lowerUsername = username.toLowerCase();
  const profile = cache[lowerUsername];

  useEffect(() => {
    if (lowerUsername && !profile) {
      dispatch(getUserProfile({ name: lowerUsername }));
    }
  }, [lowerUsername, profile, dispatch]);

  if (loading && !profile) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-white">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-nft-dark-gradient text-white">
      <Header />
      <ItemsBanner username={username} userData={profile.user}/>
      <ProfileNav username={username} userData={profile.nfts}/>
      <div className="w-[97%] h-[2px] mx-auto bg-gradient-to-r from-purple-800 via-purple-500 to-indigo-800 " />
      <div className="mt-14">{children}</div>
    </div>
  );
};

export default ProfileLayout;
