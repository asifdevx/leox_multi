import Footer from "@/components/footer/Footer";
import Header from "@/components/Header";
import ItemsBanner from "@/components/itemsComponents/ItemsBanner";
import { useFetchUserRole } from "@/hooks/fatchUserRole";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

const RootLayout = (props: any) => {
  const router = useRouter();
  const pathname = router.pathname;
 
  
  
  return (
    <div className="w-full min-h-screen flex flex-col bg-nft-dark-gradient text-white">
      <Header />
    {pathname.startsWith("/items") && <ItemsBanner/>}
      <div className="mt-20 ">{props.children}</div>
      <Footer />

    </div>
  );
};

export default RootLayout;

