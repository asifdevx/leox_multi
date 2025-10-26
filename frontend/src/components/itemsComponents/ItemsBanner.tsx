import React, { useMemo } from 'react';
import { MdCloudUpload, MdVerified } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ProfileIcon from '../HelperCom/ProfileIcon';
import Button from '../ui/Button';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { shortenAddress } from '@/utils/ShortenAddress';
import { profileUserDetails } from '@/config/Profile';
import { Role } from '@/types';
type Data = {
  name?:string,roles?:Role[],address:string 
}
const ItemsBanner = ({ username,userData }: { username?: string,userData:Data}) => {
  const profile = useSelector((s: RootState) => s.userProfile.cache[username!]);
  const user = profile?.user;

  const { name, roles, address } = user;
  const isVerified = useMemo(() => roles?.includes('Seller') ?? false, [roles]);

  return (
    <div className="section_padding w-full flex flex-col mt-24 gap-12">
      <div className="w-full h-80 flex items-center relative">
        <div className="absolute w-full h-full bg-white/10 backdrop-blur-md shadow-[0_0_15px_#00b4d8] rounded-xl" />
        <ProfileIcon
          className="w-fit h-fit absolute -bottom-9 left-5 bg-gray-600"
          width={100}
          height={100}
          address={address}
        />
      </div>

      {/* ============ Details ============ */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
        {/* left side */}
        <div className="space-y-4">
          <IsVerified isVerified={isVerified} name={name} />
          <div className="flex items-center gap-2 flex-wrap">
            <Button title="Edit Profile" othercss="bg-white text-black shadow-none text-sm" />
            <Button title="Sell" othercss="bg-white text-black shadow-none text-sm" />
            <Button title={<MdCloudUpload />} othercss="bg-white text-black shadow-none text-xl" />
            <Button
              title={<HiOutlineDotsHorizontal />}
              othercss="bg-white text-black shadow-none text-xl"
            />
          </div>
        </div>

        {/* right side */}
        <div className="space-y-3 p-2 border border-[#2d5489] rounded-lg max-w-80 w-full">
          {profileUserDetails.map((e, idx) => (
            <div className="flex items-center w-full justify-between" key={idx}>
              <p className="text-gray-400">{e.title}</p>
              <p>{idx === 2 ? shortenAddress(address) : 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemsBanner;

export const IsVerified = React.memo(
  ({ isVerified, name }: { isVerified: boolean; name: string }) => {
    return (
      <div className="text-white flex items-center gap-1">
        <h4 className="text-center">{name}</h4>
        {isVerified ? (
          <>
            <MdVerified className="text-green-300" />
            <p className="text-green-400 font-semibold">Verified</p>
          </>
        ) : (
          <>
            <MdVerified className="text-gray-500" />
            <p className="text-gray-500 font-semibold">Verified</p>
          </>
        )}
      </div>
    );
  },
);
