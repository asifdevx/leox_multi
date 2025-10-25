import OwnedPage from '@/components/Profile/OwnedPage';
import { useRouter } from 'next/router';
import React from 'react';


const owned = () => {
  const router = useRouter();
  const { username } = router.query;
  if (!username || typeof username !== 'string') return null;
  return <OwnedPage username={username} />;
};
export default owned;
