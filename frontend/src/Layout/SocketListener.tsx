import { AppDispatch } from "@/components/store/store";
import { fatchFee} from "@/reducer/feeSlice";
import { addNewNFT } from "@/reducer/nftSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";


const socket = io("http://192.168.1.100:8000", {
  withCredentials: true,
  transports: ["websocket"],
});


export default function SocketListener() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(()=>{
    socket.on("updateFee",(newFee)=>{
        dispatch(fatchFee(newFee))
    })
    socket.on("newNFTListed", (nft) => {
        dispatch(addNewNFT(nft)); 
      });
    return () =>{
        socket.off("updateFee");
        socket.off("newNFTListed");

    }
    },[dispatch])
return null;

}