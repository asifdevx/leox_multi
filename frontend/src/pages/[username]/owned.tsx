import OwnedPage from '@/components/Profile/OwnedPage';
import { useParams } from 'next/navigation';
import React from 'react';

const owned = () => {
  const {username}=useParams<{username:string}>();
  if(!username) return null;
  return <OwnedPage username={username}/>;
};
export default owned;
