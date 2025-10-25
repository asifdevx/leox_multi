import Header from '@/components/Header';
import ItemsBanner from '@/components/itemsComponents/ItemsBanner';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const ProfileLayout = ({ username, children }: { username: string; children: React.ReactNode }) => {
  const [showOwner, setShowOwner] = useState(0);

  const ProfileNavItems = [
    { title: 'Owned', path: `/owned`, showOwner },
    { title: 'On Sale', path: `/sale` },
    { title: 'Created', path: `/created` },
    { title: 'Sold', path: `/sold` },
  ];

  const { asPath } = useRouter();
  const currentPath = asPath.split("?")[0];

  return (
    <div className="w-full min-h-screen flex flex-col bg-nft-dark-gradient text-white">
      {/* <ItemsBanner username={""}/>
      <Header /> */}
      <nav className="flex gap-8 bg-black/20 py-4 text-white mt-20">
        {ProfileNavItems.map((item) => (
          <Link
            key={item.title}
            href={`/${username}${item.path}`}
            className={cn(
              'flex items-center gap-3 text-lg transition-colors',
              currentPath === `/${username}${item.path}` ? 'text-purple-400' : 'hover:text-purple-300'
            )}
          >
            <p>{item.title}</p>
            {showOwner && <p>{item.showOwner}</p>}
          </Link>
        ))}
      </nav>

      <div className="mt-20">{children}</div>
    </div>
  );
};

export default ProfileLayout;
