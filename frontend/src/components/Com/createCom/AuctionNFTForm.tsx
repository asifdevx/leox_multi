import FormInput from '../HelperCom/FormInput';
import AuctionDurationPicker from '@/components/ui/AuctionDurationPicker';
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';

interface AuctionNFTFormProps {
  value: { startingBid: string; duration: string }; // duration in seconds
  setValue: {
    setStartingBid: (startingBid: string) => void;
    setDuration: (duration: string) => void; // seconds
  };
}

const AuctionNFTForm = ({
  value: { startingBid, duration },
  setValue: { setStartingBid, setDuration },
}: AuctionNFTFormProps) => {
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [displayValue, setDisplayValue] = useState(''); // human-readable string
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowDurationPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update display value when duration changes externally
  useEffect(() => {
    if (+duration > 0) {
      const endDate = new Date(Date.now() + +duration * 1000);
      setDisplayValue(format(endDate, 'PP p')); // human-readable
    } else {
      setDisplayValue('');
    }
  }, [duration]);

  const handleDurationChange = (seconds: number) => {
    setDuration(seconds.toString()); // store seconds
    const endDate = new Date(Date.now() + seconds * 1000);
    setDisplayValue(format(endDate, 'PP p')); // human-readable
  };

  return (
    <div className="space-y-4 relative w-full ">
      {/* Starting Bid */}
      <FormInput
        label="Starting Bid (ETH)"
        value={startingBid}
        onChange={(e) => {
          let value = e.target.value.replace(/[^0-9.]/g, ""); 
          if ((value.match(/\./g) || []).length > 1) return; 
      
 
          const parts = value.split(".");
          if (parts[1]?.length > 5) parts[1] = parts[1].slice(0, 5); 
          value = parts.join(".");
          setStartingBid(value);
        }}
        placeholder="Enter starting bid"
      />

      {/* Duration Input */}

      <FormInput
        label="Auction End"
        value={displayValue}
        onChange={() => {}}
        onFocus={() => setShowDurationPicker(true)}
        placeholder="Select auction end date/time"
        inputClass="cursor-pointer"
      />

      {/* Picker Dropdown */}
      {showDurationPicker && (
        <div
          ref={pickerRef}
          className=" mt-1 w-full mx-auto bg-[#1a1b2e] border border-purple-700 rounded-xl shadow-lg z-20 p-4 transition-all duration-500"
        >
          <AuctionDurationPicker onDurationChange={handleDurationChange} />
        </div>
      )}
    </div>
  );
};

export default AuctionNFTForm;
