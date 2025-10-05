// pages/Roles.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/components/store/store";
import Button from "@/components/ui/Button";
import ShowDetails from "@/components/ui/ShowDetails";
import { fetchUsersByRole } from "@/reducer/RoleByUserSlice";
import { InteractiveCard } from "@/components/ui/InteractiveCard";
import Input from "@/components/ui/Input";
import { getUserInfo } from "@/reducer/userSlice";
import { getUserByAddress } from "@/api/api";

const Roles = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [walletAddress, setWalletAddress] = useState("");
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  const [userAddress, setuserAddress] = useState<string>("");
  const [userData, SetUserData] = useState([]);

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
    console.log(userData);
  }, [userData]);

  return (
    <section className="mt-5 w-full flex flex-col  lg:flex-row items-center lg:items-start justify-start gap-4  rounded-lg p-6">
      {/* Left Panel: Roles Overview */}
      <div className="flex flex-col justify-start items-center">
        <InteractiveCard
          width="100%"
          height="fit-content"
          className="flex flex-col gap-4 p-6"
          tailwindBgClass="bg-gray-800/30 backdrop-blur-md"
          lightSize={50}
        >
          <div className="w-full flex items-center justify-between gap-4">
            <h4 className="text-3xl  md:text-4xl font-extrabold text-white">
              Roles & Categories
            </h4>
            <Button
              title="+ Add New Role"
              handleClick={() => {}}
              othercss="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-400"
            />
          </div>

          {/* Roles list */}
          <div className="w-full flex flex-col gap-3 mt-4">
            {["Admin", "Moderator", "Ban"].map((e, idx) => (
              <ShowDetails key={idx} roleName={e} />
            ))}
          </div>
        </InteractiveCard>

        {/* Right: Role Management */}
        <div className=" w-full flex flex-col gap-4 bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-[#5797d8] hover:shadow-sm transition-all duration-300">
          <h4 className="text-2xl font-bold text-white mb-2">
            Manage User Roles
          </h4>
          <div className="flex items-center gap-2 w-full">
            <Input
              inputClass="w-full px-4 py-3   bg-gray-700 text-white  outline-none focus:outline-none focus:ring-2 focus:ring-[#00d1ff]/50 focus:border-[#00d1ff] transition xl:placeholder:text-[15px] placeholder:text-[13px] p-2 rounded-lg"
              placeholder="Enter User Address"
              handleChange={(e) => setuserAddress(e.target.value)}
              type={"text"}
              value={userAddress}
            />
            <Button
              handleClick={handleSearch}
              title="search"
              othercss="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roles;
