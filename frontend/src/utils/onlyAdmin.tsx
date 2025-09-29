import { AppDispatch, RootState } from "@/components/store/store";
import { getUserRole } from "@/reducer/roleSlice";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, ReactNode } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const { roles, loading } = useSelector((state: RootState) => state.userRole);

  const isAdmin = roles.includes("Admin") || roles.includes("Moderator");

  useEffect(() => {
    if (address) {
      dispatch(getUserRole(address));
    }
  }, [address, dispatch]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">🚫 Access Denied</h1>
        <p className="text-gray-600">
          Only Admins & Moderators can access this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
