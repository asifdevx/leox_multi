import { HeaderLists } from '@/config/HeaderLists';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState ,useCallback} from 'react';
import Image from 'next/image';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import Input from '../ui/Input';
import { CiMenuBurger } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';
import MobileSideBar from '../Com/HelperCom/MobileSideBar';
import SearchBar from '../ui/SearchBar';
import { useMediaQuery } from 'usehooks-ts';

import dynamic from 'next/dynamic';

const ConnectBtn = dynamic(() => import ('../Com/HelperCom/ConnectBtn'), {
  ssr: false,
  loading: () => <div className="w-[50px] h-[10px] bg-gray-700 rounded-lg animate-pulse" />,
});

const index = () => {

  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

 
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

  useEffect(() => {
    const header = document.querySelector('.mainHeader');
    if (!header) return;
  
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
  
    window.addEventListener('scroll', handleScroll, { passive: true });
  
    // Call once in case page is already scrolled
    handleScroll();
  
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Close search on large screens
  useEffect(() => {
    if (isDesktop) setSearchOpen(false);
  }, [isDesktop]);

  return (
    <>
      <header
        className={` mainHeader w-full z-40  duration-300 `}
      >
        <div className="section_padding flex lg:grid grid-cols-8 items-center justify-between pt-2">
          {/* Logo */}
          <div className="flex items-center gap-3 md:gap-10">
            <Link href="/" className="flex items-center gap-1">
              <Image
                src={isTablet ? '/pc_logo.png' : '/logo.png'}
                alt="logo"
                width={isTablet ? 150 : 70}
                height={isTablet ? 50 : 40}
                className="cursor-pointer object-contain"
              />
            </Link>

            {/* Mobile search icon */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="lg:hidden flex items-center justify-center mt-1"
            >
              <HiOutlineMagnifyingGlass size={24} className="text-white" />
            </button>
          </div>

          {/* Search input + nav links */}
          <div className="flex items-center lg:col-start-2 gap-5">
            {/** Desktop search input */}
            <div className="max-lg:hidden">
              <Input
                placeholder="Search your NFTs"
                type="text"
                position="right"
                icon={<HiOutlineMagnifyingGlass size={24} className="text-gray-600" />}
                inputClass="bg-[#e8eeee] text-black rounded-lg w-[400px]"
              />
            </div>

            {/* Navigation links */}
            <nav className="flex items-center gap-5 max-md:hidden">
              {HeaderLists.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.route || '#'}
                  className={`text-lg font-bold font-ponomar flex items-center gap-1 transition-colors ${
                    pathname === item.route
                      ? 'text-white text-xl border-b-2 border-[#00d1ff]'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {item.label === 'drops' && (
                    <span
                      className="ml-1 hidden md:inline-block text-[12px] px-2 py-0.5 
                      rounded-full bg-gradient-to-r from-[#00ff95] to-[#00d1ff] 
                      text-black font-semibold shadow-md animate-pulse"
                    >
                      NEW
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect + mobile menu */}
          <div className="flex gap-2 lg:col-start-8 items-center justify-center">
            <ConnectBtn />
            <button onClick={toggleMenu} className="md:hidden text-white">
              {isMenuOpen ? <IoMdClose size={24} /> : <CiMenuBurger size={24} />}
            </button>
          </div>
        </div>

      </header>
        {/* Mobile sidebar */}
        {isMenuOpen && (
          <MobileSideBar
            open={isMenuOpen}
            setOpen={setMenuOpen}
            items={HeaderLists}
            position="right"
            title="Menu"
            icon={false}
          />
        )}

      {/* Mobile search overlay */}
      {isSearchOpen && !isDesktop && (
        <SearchBar search={isSearchOpen} setSearchBar={setSearchOpen} />
      )}
    </>
  );
};

export default index;
