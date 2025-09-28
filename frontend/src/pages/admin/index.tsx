import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import { getUserRole } from "@/reducer/roleSlice";
import UserRoleTable from "@/components/admin/UserRoleTable";

const AdminDashboard = () => {
  const { address } = useAccount();
  const dispatch = useDispatch<AppDispatch>();
  const { roles, loading } = useSelector((state: RootState) => state.userRole);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (address) {
      dispatch(getUserRole(address));
    }
  }, [address, dispatch]);

  useEffect(() => {
    if (roles.includes("Admin") || roles.includes("Moderator")) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, [roles]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!authorized) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">🚫 Access Denied</h1>
        <p className="text-gray-600">Only Admins & Moderators can access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <UserRoleTable />
    </div>
  );
};

export default AdminDashboard;
