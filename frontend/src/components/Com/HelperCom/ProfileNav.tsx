import { ProfileNavItemFun } from '@/config/Profile';
import { cn } from '@/utils/cn';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';

type ProfileNavProps = {
  username?: string;
  userData?: {
    owned: any[];
    sale: any[];
    created: any[];
    sold: any[];
  };
};

const ProfileNav = ({ username, userData }: ProfileNavProps) => {
  console.count("ItemsBanner");

  const router = useRouter();
  const currentPath =useMemo(()=> router.asPath.split('?')[0] ,[router])

  const ProfileNavItems = [
    { title: 'Owned', path: '/owned', count: userData?.owned?.length ?? 0 },
    { title: 'On Sale', path: '/sale', count: userData?.sale?.length ?? 0 },
    { title: 'Created', path: '/created', count: userData?.created?.length ?? 0 },
    { title: 'Sold', path: '/sold', count: userData?.sold?.length ?? 0 },
  ];


 
  const handleNavClick = useCallback((path: string) => {
    // Use shallow + scroll:false to keep layout & position
    router.push(`/${username}${path}`, undefined, { shallow: true, scroll: false });
  },[]);

  return (
    <nav className="flex gap-3 mt-14 items-center justify-start px-3 md:px-7 text-[#E0E6F1]">
      {ProfileNavItems.map((item) => {
        const isActive = currentPath === `/${username}${item.path}`;
        return (
          <button
            key={item.title}
            onClick={() => handleNavClick(item.path)}
            className={cn(
              'flex items-center justify-center gap-1 text-[16px]/[1rem] pb-1 transition-colors border-b-2',
              isActive
                ? 'text-purple-400 border-purple-400'
                : 'text-[#E0E6F1] border-transparent hover:text-purple-300 hover:border-purple-300'
            )}
          >
            <p>{item.title}</p>
            {item.count !== 0 && (
              <span className="py-[1px] px-[4px] text-[10px] bg-[#8B5CF6] text-white rounded">
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default React.memo(ProfileNav);
