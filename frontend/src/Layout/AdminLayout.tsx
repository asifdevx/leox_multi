import SideBar from "@/components/adminCom/SideBar";
import MobileSideBar from "@/components/HelperCom/MobileSideBar";
import { sidebarLinks } from "@/config/HeaderLists";
import { useFetchUserRole } from "@/hooks/fatchUserRole";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

export default function AdminLayout(props: any) {
  const router = useRouter();
  const { roles, loading, fetched, error, address } = useFetchUserRole();

  const isAdmin = roles.includes("Admin") || roles.includes("Moderator");
  if (!isAdmin) {
    router.replace("/");
    return <p className="text-red-700 text-center text-20">Not Accessible</p>;
  }

  const [open, setOpen] = useState(false);
  function toggleBtn() {
    setOpen(!open);
  }

  return (
    <main className="h-screen bg-nft-dark-gradient w-full flex text-white max-md:flex-col ">
      <SideBar />
      <div className=" w-full flex justify-between px-8 py-4 items-center md:hidden">
        <div className="image-container">
          <Image
            src="/eth.svg"
            width={34}
            height={34}
            alt="horizon logo"
            className="size-[24px] max-xl:size-14"
          />
        </div>
        <div onClick={toggleBtn} className="">
          {open ? <IoMdClose size={24} /> : <CiMenuBurger size={24} />}
        </div>
      </div>

      {props.children}
      {open && <MobileSideBar open={open} setOpen={setOpen} icon items={sidebarLinks} position={"left"} title={"admin"} />}
    </main>
  );
}
