import React, { useCallback, useState } from "react";
import { getUserByAddress } from "@/api/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { Role, UserInfoType } from "@/types";
import { shortenAddress } from "@/utils/ShortenAddress";
import { SkeletonComRole } from "@/components/ui/skeleton";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { renderRoleButtons } from "@/components/ui/renderRoleButtons";
import { AppDispatch, RootState } from "@/components/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "@/reducer/userSlice";

const ManageUserRole = () => {
  const { address, roles: UserRoles } = useSelector(
    (state: RootState) => state.userInfo
  );
  const dispatch = useDispatch<AppDispatch>();

  const [userAddress, setuserAddress] = useState<string>("");
  const [userData, setUserData] = useState<UserInfoType | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [targetUserMainRoles, settargetUserMainRoles] = useState<Role | null>(
    null
  );
  const [originalRoles, setOriginalRoles] = useState<Role[]>([]);

  const mainRoles: Role[] = ["Admin", "Moderator", "Seller", "Buyer", "Ban"];

  // --------------------- Fetch User ---------------------
  const handleSearch = async () => {
    setLoadingUserData(true);
    try {
      if (userAddress) {
        const data = await getUserByAddress(userAddress.toLowerCase());
        setUserData(data || null);
        setOriginalRoles(data?.roles || []);
        settargetUserMainRoles(
          mainRoles.find((role) => data?.roles.includes(role)) || null
        );
      }
    } catch (error) {
      setUserData(null);
    } finally {
      setLoadingUserData(false);
    }
  };

  // --------------------- Role Disable Logic ---------------------
  const getRoleDisableStateData = (
    type: "add" | "remove",
    role: Role,
    targetedUser: UserInfoType
  ) => {
    if (!targetedUser) return true;

    const isCurrentUser = targetedUser.address.toLowerCase() === address;
    const pureModerator =
      UserRoles?.includes("Moderator") && !UserRoles?.includes("Admin");

    if (type === "remove") {
      if (isCurrentUser && role === targetUserMainRoles) return true;
      if (pureModerator && targetedUser.roles?.includes("Admin")) return true;
    }

    if (type === "add") {
      if (
        (targetedUser.roles?.includes("Admin") ||
          targetedUser.roles?.includes("Moderator")) &&
        role === "Ban"
      )
        return true;
      if (pureModerator && targetedUser.roles?.includes("Admin")) return true;
      if (pureModerator && (role === "Admin" || role === "Moderator"))
        return true;
    }

    return false;
  };

  // --------------------- Add/Remove Role ---------------------
  const removeRole = (role: Role, targetedUser: UserInfoType) => {
    if (getRoleDisableStateData("remove", role, targetedUser)) return;

    setUserData({
      ...targetedUser,
      roles: targetedUser?.roles?.filter((r) => r !== role),
    });
  };

  const addRole = useCallback(
    (role: Role, targetedUser: UserInfoType) => {
      if (getRoleDisableStateData("add", role, targetedUser)) return;

      setUserData({
        ...targetedUser,
        roles: [...(targetedUser.roles || []), role],
      });
    },
    [userData, UserRoles, targetUserMainRoles]
  );
  // --------------------- Check if Roles Changed ---------------------
  const isRolesChanged = () => {
    if (!userData) return false;
    if (userData.roles?.length !== originalRoles.length) return true;

    const sortedCurrent = [...userData.roles].sort();
    const sortedOriginal = [...originalRoles].sort();

    return sortedCurrent.some((role, idx) => role !== sortedOriginal[idx]);
  };

  // --------------------- Apply Changes ---------------------
  const changeUserRole = async () => {
    if (!userData || !isRolesChanged()) return;

    await dispatch(
      updateUserInfo({ address: userData.address, roles: userData.roles })
    );
    setOriginalRoles(userData.roles!); // Update original roles after apply
  };

  return (
    <div className="flex flex-col w-full lg:w-1/3 gap-6 mx-auto">
      {/* Search */}
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

      {/* User Info */}
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

      {/* Role Management */}
      {userData && (
        <div className="bg-gray-800 p-4 rounded-xl shadow-md flex flex-col gap-6">
          <div>
            <h5 className="font-semibold text-lg mb-2 text-white">
              Current Roles
            </h5>
            <div className="flex flex-wrap gap-2">
              {renderRoleButtons(
                userData?.roles || [],
                (r) => userData.roles?.includes(r)!,
                <IoCloseSharp className="text-red-600" />,
                (role) => removeRole(role, userData),
                {
                  disableFn: (role) =>
                    getRoleDisableStateData("remove", role, userData),
                }
              )}
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-lg mb-2 text-white">Add Roles</h5>
            <div className="flex flex-wrap gap-2">
              {renderRoleButtons(
                userData?.roles || [],
                (r) => !userData.roles?.includes(r),
                <IoMdAdd className="text-green-600" />,
                (role) => addRole(role, userData),
                {
                  disableFn: (role) =>
                    getRoleDisableStateData("add", role, userData),
                }
              )}
            </div>
          </div>

          {/* Apply/Cancel */}
          <div className="w-full flex items-center gap-3 justify-center">
            <Button
              title="Cancel"
              handleClick={() => setUserData(null)}
              othercss="bg-red-600 text-white font-bold"
            />
            <Button
              title="Apply Change"
              handleClick={changeUserRole}
              othercss="bg-green-600 text-white font-bold"
              loading={!isRolesChanged()} // disable when roles not changed
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUserRole;
