import { HeaderLists } from "@/config/HeaderLists";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import Input from "../ui/Input";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import MobileSideBar from "../Com/HelperCom/MobileSideBar";
import SearchBar from "../ui/SearchBar";
import { useMediaQuery } from "usehooks-ts";
import ConnectBtn from "../Com/HelperCom/ConnectBtn";

const index = () => {
  const pathname = usePathname();
  const searchMatches = useMediaQuery("(min-width: 1024px)");
  const isDekstop = useMediaQuery("(min-width: 768px)");

  const [isScroll, setScroll] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOPen] = useState(false);

  function toggleBtn() {
    setOpen(!open);
  }

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (searchMatches) {
      setSearchOPen(false);
    }
  }, [searchMatches]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 bg-nft-dark-gradient text-white w-full z-40`}
      >
        <div className="w-full flex lg:grid pt-2 grid-cols-8 justify-between section_padding">
          {/* Logo section  */}
          <div className="h-full flex items-center md:gap-10 gap-3 ">
            <Link className=" flex gap-1 items-center" href="/admin">
              <img
                src={isDekstop ? "/pc_logo.png" : "/logo.png"}
                alt="logo"
                
                className="w-[70px] md:w-[150px] h-auto object-fill cursor-pointer"
              />
            </Link>
            <div className="lg:hidden items-center mt-1">
              <HiOutlineMagnifyingGlass
                size={24}
                className="text-[#fff]"
                onClick={() => setSearchOPen(true)}
              />
            </div>
          </div>

          {/* Input section  */}
          <div className="flex items-center lg:col-start-2 gap-5">
            <div className=" max-lg:hidden">
              <Input
                placeholder={"searce your nfts"}
                type={"text"}
                position={"right"}
                icon={
                  <HiOutlineMagnifyingGlass
                    size={24}
                    className="text-[#7a5454]"
                  />
                }
                inputClass={"bg-[#e8eeee] text-black rounded-lg w-[400px]"}
              />
            </div>
            <div className="flex items-center gap-5 max-md:hidden">
              {HeaderLists.map((items, idx) => (
                <div key={idx}>
                  <Link
                    href={items.route || ""}
                    className={` text-lg flex items-center gap-[2px] font-bold font-ponomar text-gray-300 ${
                      pathname == items.route &&
                      "text-white text-xl border-b-2 border-[#00d1ff]"
                    }`}
                  >
                    <p className="min-md:hidden">{items.label}</p>
                    {items.label === "drops" && (
                      <span
                        className="ml-1 hidden md:inline-block text-[12px] px-2 py-0.5 
    rounded-full bg-gradient-to-r from-[#00ff95] to-[#00d1ff] 
    text-black font-semibold shadow-md animate-pulse"
                      >
                        NEW
                      </span>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {/* connect btn section  */}
          <div className="flex gap-2 lg:col-start-8 items-center justify-center">
            <ConnectBtn />
            <div onClick={toggleBtn} className="md:hidden">
              {open ? <IoMdClose size={24} /> : <CiMenuBurger size={24} />}
            </div>
          </div>
        </div>
        {open && <MobileSideBar open={open} setOpen={setOpen} items={HeaderLists} position={"right"} title={"Menu"} icon={false} />}
      </div>
      {searchOpen && !searchMatches && (
        <SearchBar search={searchOpen} setSearchBar={setSearchOPen} />
      )}
    </>
  );
};

export default index;
