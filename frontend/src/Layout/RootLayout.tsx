import Footer from "@/components/footer/Footer";
import Header from "@/components/Header";
import { AppDispatch, RootState } from "@/components/store/store";
import { useFetchUserRole } from "@/hooks/fatchUserRole";
import { getUserRole } from "@/reducer/roleSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

const RootLayout = (props: any) => {
 const {address} = useFetchUserRole();
 console.log(address,"address");
 
  return (
    <div className="w-screen min-h-screen flex flex-col bg-nft-dark-gradient text-white">
      <Header />
      <div className="mt-20 ">{props.children}</div>
      <Footer />

    </div>
  );
};

export default RootLayout;

