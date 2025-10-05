
import UserRoleTable from "@/components/adminCom/UserRoleTable";


const AdminDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <UserRoleTable />
    </div>
  );
};



export default AdminDashboard;
