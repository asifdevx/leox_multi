import { AppDispatch } from "@/components/store/store";
import { fatchFee} from "@/reducer/feeSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";


const socket = io("http://192.168.2.108:8000", {
  withCredentials: true,
  transports: ["websocket"],
});


export default function SocketListener() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(()=>{
    socket.on("feeUpdate",(newFee)=>{
        dispatch(fatchFee(newFee))
    })
    return () =>{
        socket.off("feeUpdate")
    }
    },[dispatch])
return null;

}