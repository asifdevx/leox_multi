// src/pages/admin/index.tsx
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/components/store/store";
import AdminLayout from "@/Layout/AdminLayout";
import UserRoleTable from "@/components/adminCom/UserRoleTable";
import { useEffect } from "react";
import { getUserRole } from "@/reducer/roleSlice";
import { useAccount } from "wagmi";

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const { roles, loading } = useSelector((state: RootState) => state.userRole);

  const isAdmin = roles.includes("Admin") || roles.includes("Moderator");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <UserRoleTable />
    </div>
  );
};



export default AdminDashboard;
