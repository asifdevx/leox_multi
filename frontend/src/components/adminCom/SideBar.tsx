import { sidebarLinks } from "@/config/HeaderLists";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
const SideBar = () => {
 const logoMedia = useMediaQuery("(min-width: 1280px)")

  const pathName = usePathname();

  return (
    <div className="sidebar">
      <div className="flex flex-col gap-4">
        <Link href="/" className="flex  items-center  flex-col cursor-pointer">
          <Image
            src="/logo.png"
            width={logoMedia ? 200 : 70}
            height={logoMedia ? 100 : 70}
            alt="Leo"
            fetchPriority="high"
            className="object-center object-contain cursor-pointer "
          />
          <h1 className="sidebar-logo relative -top-6 space-x-3">LeoX</h1>
        </Link>
        {sidebarLinks.map((items) => (
          <Link href={items.route} key={items.label}>
            <div className={ `flex gap-2 p-4 items-center ${pathName === items.route ? "active-link " : "text-sidebarText"}`}>
              <Image
                src={items.imgURL}
                alt={items.imgURL}
                width={34}
                height={34}
                fetchPriority="high"
                className={pathName === items.route ? "brightness-[3] invert-0" : ""}/>
              <p className="text-16 font-semibold max-xl:hidden ">{items.label}</p>
            </div>
          </Link>
        ))}
      </div>
          {/* FOOTER  */}
          

    </div>
  );
};

export default SideBar;
