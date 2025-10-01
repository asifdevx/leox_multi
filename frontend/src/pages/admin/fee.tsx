import { AppDispatch, RootState } from "@/components/store/store";
import Button from "@/components/ui/Button";
import FeeSlider from "@/components/ui/feeSlider";
import { changeFee, fatchFee } from "@/reducer/feeSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const FeePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fee = useSelector((state: RootState) => state.fee.value);
  const [value, setValue] = useState<number>(fee);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fatchFee());
  }, [fee, dispatch])


  async function handleClick() {
    setLoading(true)
    try {
      dispatch(changeFee(value * 10));
    } catch (error: any) {
      console.warn("failed to changing fee", error?.message);

    } finally {
      setLoading(false)

    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Fee Management</h1>
     <div className="flex items-center gap-3">

      <FeeSlider value={value} setValue={setValue} />
      <Button title={loading ? "updating.." : "update"} handleClick={handleClick} othercss={"py-2 px-3 text-26 rounded-lg "} />
     </div>

    </div>
  );
};

export default FeePage;
