import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { AppDispatch, RootState } from "@/components/store/store";
import { clearRole, getUserInfo } from "@/reducer/userSlice";
import { setAddress } from "@/reducer/userSlice";

export function useFetchUserRole() {
  const { address } = useAccount();
  const lowercaseAddress=address?.toLowerCase();
  const dispatch = useDispatch<AppDispatch>();
  const {
    roles,
    loading,
    fetched,
    error,
    address: UserAddress,
  } = useSelector((state: RootState) => state.userInfo);

  useEffect(() => {
    if (lowercaseAddress && UserAddress !== lowercaseAddress) {
      dispatch(setAddress(address));
    }
    if (!lowercaseAddress && UserAddress) {
      dispatch(clearRole()); 
    }
  }, [address, dispatch, UserAddress]);

  useEffect(() => {
    if (address && (UserAddress !== lowercaseAddress || !fetched) && !loading) {
      dispatch(getUserInfo({address}));
    }
  }, [address, UserAddress, fetched, loading, dispatch]);

  return { roles, loading, fetched, error, address };
}
