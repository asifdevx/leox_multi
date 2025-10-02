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
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { roles } = useFetchUserRole();

  const isAdmin = roles.includes("Admin") || roles.includes("Moderator");
  if (!isAdmin) {
    router.replace("/");
    return <p className="text-red-700 text-center text-20">Not Accessible</p>;
  }

  function toggleBtn() {
    setOpen(!open);
  }

  return (
    <main className=" h-full bg-nft-dark-gradient w-full flex text-white max-md:flex-col ">
      <SideBar />
      <div className=" w-full flex justify-between px-8 py-4 items-center md:hidden">
        <div className="">
          <h1>leox</h1>
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
