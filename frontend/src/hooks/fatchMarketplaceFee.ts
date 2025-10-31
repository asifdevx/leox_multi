import { RootState, AppDispatch } from "@/components/store/store";
import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fatchFee } from "@/reducer/feeSlice";

export const fatchMarketplaceFee =()=>{
    const  {history}= useSelector((state: RootState) => state.fee);
    const dispatch = useDispatch<AppDispatch>();
    const fee = useMemo(()=> history.length > 0 ? history[0].fee : 0,[history.length])
    
    useEffect(() => {
      if(fee===0){
        dispatch(fatchFee());
      }
    }, [fee]);

    return fee;
} 