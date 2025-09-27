import { setFee } from "@/reducer/feeSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";


const socket = io("http://192.168.0.100:8000", {
  withCredentials: true,
  transports: ["websocket"],
});


export default function SocketListener() {
    const dispatch = useDispatch();

    useEffect(()=>{
    socket.on("feeUpdate",(newFee:number)=>{
        console.log("feeUpdate");
        
        dispatch(setFee(newFee));
    })
    return () =>{
        socket.off("feeUpdate")
    }
    },[dispatch])
return null;

}