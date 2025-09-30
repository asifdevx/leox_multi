
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { AppDispatch, RootState } from "@/components/store/store";
import { getUserRole } from "@/reducer/roleSlice";
import { setAddress } from "@/reducer/roleSlice";

export function useFetchUserRole() {
  const { address } = useAccount();
  const dispatch = useDispatch<AppDispatch>();
  const { roles, loading, fetched, error } = useSelector(
    (state: RootState) => state.userRole
  );

  // 🔄 Reset roles when wallet address changes
  useEffect(() => {
    if (address) {
      dispatch(setAddress(address));
    }
  }, [address, dispatch]);

  // ✅ Fetch roles only once per wallet
  useEffect(() => {
    if (address && !fetched && !loading) {
      dispatch(getUserRole(address));
    }
  }, [address, fetched, loading, dispatch]);

  return { roles, loading, fetched, error, address };
}
