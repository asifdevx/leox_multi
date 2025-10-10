// pages/Users.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/components/store/store";
import Button from "@/components/ui/Button";
import ShowDetails from "@/components/ui/ShowDetails";
import { fetchUsersByRole } from "@/reducer/RoleByUserSlice";
import { InteractiveCard } from "@/components/ui/InteractiveCard";
import Input from "@/components/ui/Input";
import { getUserByAddress } from "@/api/api";
import { RoleCatagories } from "@/config/RoleList";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [walletAddress, setWalletAddress] = useState("");
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  const [userAddress, setuserAddress] = useState<string>("");
  const [userData, SetUserData] = useState<any>(null);

  // Mocked role modification handlers
  const handleAddRole = () => {
    if (newRole && !userRoles.includes(newRole)) {
      setUserRoles([...userRoles, newRole]);
      setNewRole("");
    }
  };

  const handleRemoveRole = (role: string) => {
    setUserRoles(userRoles.filter((r) => r !== role));
  };

  const handleSearch = async () => {
    if (userAddress) {
      const data = await getUserByAddress(userAddress.toLowerCase());
      SetUserData(data);
    }
  };

  useEffect(() => {
    console.log("User Data:", userData);
  }, [userData]);

  return (
    <section className="mt-5 w-full flex flex-col lg:flex-row items-start justify-between gap-6 rounded-lg p-6">
      {/* LEFT SIDE */}
      <div className="flex flex-col w-full lg:w-2/3 gap-6">
        {/* Roles & Categories */}
        <InteractiveCard
          width="100%"
          height="fit-content"
          className="flex flex-col gap-4 p-6"
          tailwindBgClass="bg-gray-800/30 backdrop-blur-md"
          lightSize={50}
        >
          <div className="w-full flex items-center justify-between gap-4">
            <h4 className="text-3xl md:text-4xl font-extrabold text-white">
              Roles & Categories
            </h4>
            <Button
              title="+ Add New Role"
              handleClick={() => {}}
              othercss="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400"
            />
          </div>

          <div className="w-full flex flex-col gap-3 mt-4">
            {["Admin", "Moderator", "Ban"].map((role, idx) => (
              <ShowDetails key={idx} roleName={role} />
            ))}
          </div>
        </InteractiveCard>

        {/* Role Permissions Section */}
        <div className="w-full bg-gray-800/40 rounded-xl p-6 backdrop-blur-md">
          <h4 className="text-2xl font-semibold text-white mb-4">
            Role Permissions
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RoleCatagories.map(({ role, perms }) => (
              <div
                key={role}
                className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
              >
                <h5 className="text-lg font-bold text-cyan-400 mb-2">{role}</h5>
                <ul className="text-gray-300 text-sm list-disc list-inside">
                  {perms.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Role Stats */}
       
      </div>
{/* ------------------------------ */}
{/*  */}
      {/* RIGHT SIDE */}
      <div className="flex flex-col w-full lg:w-1/3 gap-6">
        {/* Manage User Roles */}
        <div className="w-full bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-[#5797d8] hover:shadow-sm transition-all duration-300">
          <h4 className="text-2xl font-bold text-white mb-2">
            Manage User Roles
          </h4>
          <div className="flex items-center gap-2 w-full">
            <Input
              inputClass="w-full px-4 py-3 bg-gray-700 text-white outline-none focus:outline-none focus:ring-2 focus:ring-[#00d1ff]/50 focus:border-[#00d1ff] transition xl:placeholder:text-[15px] placeholder:text-[13px] p-2 rounded-lg"
              placeholder="Enter User Address"
              handleChange={(e) => setuserAddress(e.target.value)}
              type="text"
              value={userAddress}
            />
            <Button
              handleClick={handleSearch}
              title="Search"
              othercss="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
            />
          </div>
        </div>

        {/* User Info Display */}

        <div className="w-full bg-gray-800/60 rounded-xl p-6">
          <h4 className="text-2xl font-semibold text-white mb-4">
            User Information
          </h4>
          <div className="flex flex-col gap-2 text-gray-300">
            <p>
              <span className="text-cyan-400 font-medium">Username:</span>{" "}
              xashadul
            </p>
            <p>
              <span className="text-cyan-400 font-medium">Wallet:</span>{" "}
              0xdefheggnjnrtn65by5b1g16hyt6bn ynjh
            </p>
            <p>
              <span className="text-cyan-400 font-medium">Roles:</span>{" "}
              {userData ? userData.roles?.join(", ") : "roles are here"}
            </p>
          </div>
        </div>

        {/* Role Activity Log */}
        <div className="w-full bg-gray-800/40 rounded-xl p-6">
          <h4 className="text-2xl font-semibold text-white mb-4">
            Recent Role Activity
          </h4>
          <div className="flex flex-col gap-3 text-gray-300 text-sm">
            {[
              {
                user: "0x08...5508",
                action: "Added 'Moderator'",
                time: "2 mins ago",
              },
              {
                user: "0x24...720d",
                action: "Removed 'Ban'",
                time: "10 mins ago",
              },
              {
                user: "0x9f...aa1b",
                action: "Added 'Verified Artist'",
                time: "30 mins ago",
              },
            ].map((log, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-900/70 rounded-lg px-4 py-2 hover:bg-gray-900/90 transition-all"
              >
                <span>
                  <b className="text-cyan-400">{log.user}</b> {log.action}
                </span>
                <span className="text-gray-500">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Users;
