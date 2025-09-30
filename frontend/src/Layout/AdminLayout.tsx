import SideBar from "@/components/adminCom/SideBar";
import { useFetchUserRole } from "@/hooks/fatchUserRole";
import Image from "next/image";
import { useRouter } from "next/router";


export default function AdminLayout(props: any) {
  const router = useRouter();
 const { roles, loading, fetched, error, address} = useFetchUserRole();

  const isAdmin = roles.includes("Admin") || roles.includes("Moderator");
  if (!isAdmin) {
    router.replace("/");
    return <p className="text-red-700 text-center text-20">Not Accessible</p>;
  }

  return (
    <main className="h-screen w-full flex  max-md:flex-col ">
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
      </div>

      {props.children}
    </main>
  );
}
