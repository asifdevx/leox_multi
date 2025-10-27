import CreatedPage from '@/components/Profile/CreatedPage';
import OwnedPage from '@/components/Profile/OwnedPage';
import SalePage from '@/components/Profile/SalePage';
import SoldPage from '@/components/Profile/SoldPage';
import { useRouter } from 'next/router'
import React from 'react'

const index = () => {
    const {tab} =useRouter().query;

    if (!tab || typeof tab !== "string") {
      return <p>Loading...</p>;
    }
    
 const renderTab = () => {
    switch (tab) {
      case "owned":
        return <OwnedPage />;
      case "created":
        return <CreatedPage />;
      case "sold":
        return <SoldPage />;
      case "sale":
        return <SalePage />;
      default:
        return <p>Tab not found</p>;
    }
  };
  return (
    <div className=''>{renderTab()}</div>
  )
}

export default index