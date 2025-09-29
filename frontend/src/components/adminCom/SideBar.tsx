"use client";


import { sidebarLinks } from "@/config/HeaderLists";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


const SideBar = () => {
 
  const pathName = usePathname();
  return (
    <div className="sidebar">
      <div className="flex flex-col gap-4">
        <Link href="/" className="mb-12 flex gap-3 items-center cursor-pointer">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="horizon logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        {sidebarLinks.map((items) => (
          <Link href={items.route} key={items.label}>
            <div className={ `flex gap-2 p-4 items-center rounded-[6px] ${pathName === items.route ? "active-link" : "text-black-2"}`}>
              <Image
                src={items.imgURL}
                alt={items.imgURL}
                width={34}
                height={34}
                className={pathName === items.route ? "brightness-[3] invert-0" : ""}/>
              <p className="text-16 font-semibold max-xl:hidden">{items.label}</p>
            </div>
          </Link>
        ))}
      </div>
          {/* FOOTER  */}
          

    </div>
  );
};

export default SideBar;
