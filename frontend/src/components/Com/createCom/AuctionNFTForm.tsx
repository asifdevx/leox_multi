import FormInput from '@/components/HelperCom/FormInput';
import React from 'react'
interface AuctionNFTFormProps {
    value: { startingBid: string; duration: string };
    setValue: {
        setStartingBid: (startingBid: string) => void;
        setDuration: (duration: string) => void;
    };
  }
const AuctionNFTForm = ({value:{startingBid,duration},setValue:{setDuration,setStartingBid}}:AuctionNFTFormProps) => {
  return (
    <>
     <FormInput label="Starting Bid (ETH)" value={startingBid} onChange={(e) => setStartingBid(e.target.value.replace(/[^0-9.]/g, ""))} placeholder={'st'} />
      <FormInput label="Duration (seconds)" value={duration} onChange={(e) => setDuration(e.target.value.replace(/[^0-9.]/g, ""))} placeholder={'st2'}/>
     
    </>
  )
}

export default AuctionNFTForm