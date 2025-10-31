import React, { useMemo } from 'react';
import blockies from 'ethereum-blockies';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { cn } from '@/utils/cn';

const ProfileIcon = ({className,width,height,address,border=true}:{className?:string,address:string,width:number,height:number ,border?:boolean }) => {
 
  const icon = useMemo(() => {
    if (!address) return null;
    return blockies.create({ seed: address.toLowerCase(), size: 8, scale: 4 }).toDataURL();
  }, [address]);

  return (
    <div className={cn( border && "p-2 bg-gray-800  rounded-full",className)}>
      <Image
        src={icon || "/eth.svg"}
        width={width}
        height={height}
        alt="Identicon"
        fetchPriority="high"
        className="rounded-full"
      />
    </div>
  );
};

export default React.memo(ProfileIcon);
