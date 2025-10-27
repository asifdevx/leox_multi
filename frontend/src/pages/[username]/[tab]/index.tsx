import CreatedPage from '@/components/Profile/CreatedPage';
import OwnedPage from '@/components/Profile/OwnedPage';
import SalePage from '@/components/Profile/SalePage';
import SoldPage from '@/components/Profile/SoldPage';
import { useRouter } from 'next/router'
import React from 'react'

const index = () => {
    const {username,tab} =useRouter().query;

    if (!username || !tab || typeof username !== "string" || typeof tab !== "string") {
      return <p>Loading...</p>;
    }
    
 const renderTab = () => {
    switch (tab) {
      case "owned":
        return <OwnedPage username={username} />;
      case "created":
        return <CreatedPage username={username} />;
      case "sold":
        return <SoldPage username={username} />;
      case "sale":
        return <SalePage username={username} />;
      default:
        return <OwnedPage username={username} />;
    }
  };
  return (
    <div className='section_padding w-full '>{renderTab()}</div>
  )
}

export default index