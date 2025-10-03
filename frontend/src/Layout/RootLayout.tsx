import Footer from "@/components/footer/Footer";
import Header from "@/components/Header";
import { useFetchUserRole } from "@/hooks/fatchUserRole";
import { useEffect } from "react";

const RootLayout = (props: any) => {
  
  return (
    <div className="w-full min-h-screen flex flex-col bg-nft-dark-gradient text-white">
      <Header />
      <div className="mt-20 ">{props.children}</div>
      <Footer />

    </div>
  );
};

export default RootLayout;

