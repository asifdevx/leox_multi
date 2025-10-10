import React, { useState } from "react";
import { getUserByAddress } from "@/api/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { UserInfoType } from "@/types";
import { shortenAddress } from "@/components/ui/ShortenAddress";
import { SkeletonComRole } from "@/components/ui/skeleton";

const ManageUserRole = () => {
  const [userAddress, setuserAddress] = useState<string>("");
  const [userData, setUserData] = useState<UserInfoType | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);

  const handleSearch = async () => {
    setLoadingUserData(true);
    try {
      if (userAddress) {
        const data = await getUserByAddress(userAddress.toLowerCase());
        setUserData(data || null);
        
      }
    } catch (error) {
      console.log(error);
      setUserData( null);
      
    }finally{
      setLoadingUserData(false)
    }
  };

  return (
    <>
      {/* ------------------------ */}
      {/* Search user by address   */}
      {/* ------------------------ */}
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
      {/* ------------------------ */}
      {/*       user Infos          */}
      {/* ------------------------ */}
      <div className="w-full flex-row md:flex-col items-center ">
        {userData && !loadingUserData ? (
          <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg shadow-md">
            <Image
              src="/profile_icon.svg"
              alt="profile"
              width={40}
              height={40}
              className="rounded-full  bg-cyan-200 "
            />
            <div className="flex flex-col items-start gap-3">
              <h6>{userData?.name}</h6>
              <p>{userData?.gmail}</p>
              <p>{shortenAddress(userData?.address)}</p>
            </div>
          </div>
            ) : (
          <SkeletonComRole/>
        )}

        <div className="">

        </div>
      </div>
    </>
  );
};

export default ManageUserRole;
