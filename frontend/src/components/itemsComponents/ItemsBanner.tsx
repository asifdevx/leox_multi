import React, { useMemo } from 'react';
import { MdCloudUpload, MdVerified } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import ProfileIcon from '../HelperCom/ProfileIcon';
import { RootState, selector } from '../store/store';
import Button from '../ui/Button';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { shortenAddress } from '@/utils/ShortenAddress';
import { profileUserDetails } from '@/config/Profile';

const ItemsBanner = ({username}:{username?:string}) => {
  const { name, roles, address } = selector().userInfo;
  const isVerified = useMemo(() => roles?.includes('Seller') as boolean, [roles]);
  return (
    <div className="section_padding w-full flex flex-col  mt-24 gap-12">
      <div className="w-full h-80 flex items-center relative">
        <div className="absolute w-full h-full bg-white/10 backdrop-blur-md shadow-[0_0_15px_#00b4d8] rounded-xl " />
        <ProfileIcon
          className="w-fit h-fit absolute -bottom-9 left-5 bg-gray-600"
          width={100}
          height={100}
          address={address}
        />
      </div>
      {/* ============ Details ============ */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
        {/* left side  */}
        <div className="space-y-2">
          <IsVerfied isVerified={isVerified} name={name!} />
          <div className="flex  items-center gap-2 flex-wrap">
            <Button title="Edit Profile" othercss="bg-white text-black shadow-none text-sm" />
            <Button title="sell" othercss="bg-white text-black shadow-none text-sm" />
            <Button title={<MdCloudUpload />} othercss="bg-white text-black shadow-none text-xl" />
            <Button
              title={<HiOutlineDotsHorizontal />}
              othercss="bg-white text-black shadow-none text-xl"
            />
          </div>
        </div>
        {/* right side  */}
        <div className="space-y-3 p-2 border border-[#2d5489] rounded-lg max-w-80 w-full">
          {profileUserDetails.map((e, idx) => (
            <div className="flex items-center w-full justify-between" key={idx}>
              <p className="text-gray-400">{e.title}</p>
              <p>{idx == 2 ? shortenAddress(address) : 0}</p>
            </div>
          ))}
        </div>
      </div>
    
    </div>
  );
};

export default ItemsBanner;

export const IsVerfied = React.memo(
  ({ isVerified, name }: { isVerified: boolean; name: string }) => {
    return (
      <div className="text-white flex items-center gap-1">
        <h5>{name}</h5>
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
