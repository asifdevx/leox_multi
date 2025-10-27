import { cn } from '@/utils/cn';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

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
  const { asPath } = useRouter();
  const currentPath = asPath.split('?')[0];

  // Use the lengths of each array for the badge count
  const ProfileNavItems = [
    { title: 'Owned', path: '/owned', showItem: userData?.owned?.length ?? 0 },
    { title: 'On Sale', path: '/sale', showItem: userData?.sale?.length ?? 0 },
    { title: 'Created', path: '/created', showItem: userData?.created?.length ?? 0 },
    { title: 'Sold', path: '/sold', showItem: userData?.sold?.length ?? 0 },
  ];

  return (
    <nav className="flex gap-3 mt-14 items-center px-3 md:px-7 text-[#E0E6F1]">
      {ProfileNavItems.map((item) => (
        <Link
          key={item.title}
          href={`/${username}${item.path}`}
          className={cn(
            'flex items-center justify-center gap-1 text-[16px]/[1rem] transition-colors pb-1',
            currentPath === `/${username}${item.path}`
              ? 'text-purple-400 border-purple-400 border-b-[3px]'
              : 'text-[#E0E6F1] hover:text-purple-300'
          )}
        >
          <p>{item.title}</p>
          {item.showItem !== 0 && (
            <div className="py-0 px-1 text-center text-[10px] bg-[#8B5CF6] text-white rounded">
              {item.showItem}
            </div>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default React.memo(ProfileNav);
