import React, { useState } from "react";
import { getUserByAddress } from "@/api/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { Role, UserInfoType } from "@/types";
import { shortenAddress } from "@/components/ui/ShortenAddress";
import { SkeletonComRole } from "@/components/ui/skeleton";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { renderRoleButtons } from "@/components/ui/renderRoleButtons";
import { RootState } from "@/components/store/store";
import { useSelector } from "react-redux";

const ManageUserRole = () => {
  const { address, roles: UserRoles } = useSelector(
    (state: RootState) => state.userInfo
  );
  const [userAddress, setuserAddress] = useState<string>("");
  const [userData, setUserData] = useState<UserInfoType | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [originalRoles, setOriginalRoles] = useState<Role[]>([]);
  const [targetUserMainRoles, settargetUserMainRoles] = useState<Role | null>(
    null
  );

  const mainRoles: Role[] = ["Admin", "Moderator", "Seller", "Buyer", "Ban"];

  const handleSearch = async () => {
    setLoadingUserData(true);
    try {
      if (userAddress) {
        const data = await getUserByAddress(userAddress.toLowerCase());
        setUserData(data || null);
        setOriginalRoles(data?.roles || []);
        settargetUserMainRoles(
          mainRoles.find((e) => data.roles.includes(e)) || null
        );
      }
    } catch (error) {
      setUserData(null);
    } finally {
      setLoadingUserData(false);
    }
  };

  const getRoleDisableStateData = (
    type: string,
    role: Role,
    targetedUser: UserInfoType
  ) => {
    if(!targetedUser) return true;
    const isTheCurrentUser = targetedUser?.address.toLowerCase() == address;
    const pureModerator =
      UserRoles?.includes("Moderator") && !UserRoles?.includes("Admin");

    if (type == "remove") {
      if (isTheCurrentUser && role === targetUserMainRoles) return true; //user cann't remove their main roles
      if (pureModerator && targetedUser.roles?.includes("Admin")) return true; //modaretor cannot remove any of the admin roles
    }

    if (type == "add") {
      if (
        (targetedUser.roles?.includes("Admin") ||
          targetedUser.roles?.includes("Moderator")) && // When Admin and moderator role active ban cannot but add to role
        role == "Ban"
      )
        return true;
      if (pureModerator && targetedUser.roles?.includes("Admin")) return true;
      if (pureModerator && (role === "Admin" || role === "Moderator"))
        return true;
    }
    return false;
  };

  const removeRole = (role: Role, targetedUser: UserInfoType) => {
    if (!targetedUser || getRoleDisableStateData("remove", role, targetedUser))
      return;

    const updatedRoles = targetedUser.roles?.filter((r) => r !== role) || [];
    setUserData({ ...targetedUser, roles: updatedRoles });
  };

  const addRole = (role: Role, targetedUser: UserInfoType) => {
    if (!targetedUser || getRoleDisableStateData("add", role, targetedUser))
      return;

    setUserData({
      ...targetedUser,
      roles: [...(targetedUser.roles || []), role],
    });
  };

  return (
    <div className="flex flex-col w-full lg:w-1/3 gap-6 mx-auto">
      {/* ------------------------ */}
      {/* Search User */}
      {/* ------------------------ */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-4">
        <h4 className="text-2xl font-bold text-white">Manage User Roles</h4>
        <div className="flex gap-2 w-full">
          <Input
            inputClass="w-full px-4 py-3 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-sm"
            placeholder="Enter User Address"
            handleChange={(e) => setuserAddress(e.target.value)}
            type="text"
            value={userAddress}
          />
          <Button
            handleClick={handleSearch}
            title="Search"
            othercss="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      {/* ------------------------ */}
      {/* User Info */}
      {/* ------------------------ */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md flex items-center gap-4">
        {loadingUserData ? (
          <SkeletonComRole />
        ) : userData ? (
          <>
            <Image
              src="/profile_icon.svg"
              alt="profile"
              width={50}
              height={50}
              className="rounded-full bg-cyan-200"
            />
            <div className="flex flex-col gap-1">
              <h5 className="font-semibold text-lg text-white">
                {userData.name}
              </h5>
              <p className="text-sm text-gray-300">{userData.gmail}</p>
              <p className="text-sm text-gray-400">
                {shortenAddress(userData.address)}
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-400">No user found.</p>
        )}
      </div>

      {/* ------------------------ */}
      {/* Role Management */}
      {/* ------------------------ */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md flex flex-col gap-6">
        {/* Current Roles */}
        <div>
          <h5 className="font-semibold text-lg mb-2 text-white">
            Current Roles
          </h5>
          <div className="flex flex-wrap gap-2">
            {renderRoleButtons(
              userData?.roles || [],
              (r) => userData?.roles?.includes(r)!,
              <IoCloseSharp className="text-red-600" />,
              (role) => removeRole(role, userData!),
              {
                disableFn(role: Role) {
                  return getRoleDisableStateData("remove", role, userData!);
                },
              }
            )}
          </div>
        </div>

        {/* Add Roles */}
        <div>
          <h5 className="font-semibold text-lg mb-2 text-white">Add Role</h5>
          <div className="flex flex-wrap gap-2">
            {renderRoleButtons(
              userData?.roles || [],
              (r) => !userData?.roles?.includes(r)!,
              <IoMdAdd className="text-green-600" />,
              (role) => addRole(role, userData!),
              {
                disableFn(role) {
                  return getRoleDisableStateData("add", role, userData!);
                },
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUserRole;
