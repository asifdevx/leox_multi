// ProfileLayout.tsx
import React, { useEffect } from 'react';
import Header from '@/components/Header';

import { AppDispatch, RootState } from '@/components/store/store';
import { getUserProfile } from '@/reducer/userProfile';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ItemsBanner from '@/components/Com/itemsComponents/ItemsBanner';
import ProfileNav from '@/components/Com/HelperCom/ProfileNav';
import ProfileStatusWrapper from '@/components/Com/HelperCom/ProfileStatusWrapper';
import useUserProfile from '@/hooks/useUserProfile';

interface ProfileLayoutProps {
  username: string;
  children:  React.ReactNode;
}

const ProfileLayout = ({ username, children }: ProfileLayoutProps) => {

  const { profile, loading, error, retry } = useUserProfile(username as string);
  
  return (
    <ProfileStatusWrapper loading={loading} error={error} profile={profile} onRetry={retry}>
    <div className="w-full min-h-screen flex flex-col bg-nft-dark-gradient text-white">
      <Header />
      <ItemsBanner username={username} userData={profile?.user}/>
      <ProfileNav username={username} userData={profile?.nfts}/>
      <div className="w-[97%] h-[2px] mx-auto bg-gradient-to-r from-purple-800/50 via-purple-500/50 to-indigo-800 relative inset-0 top-0" />
      <div className="mt-14">{children}</div>
    </div>
    </ProfileStatusWrapper>
  );
};

export default ProfileLayout;
