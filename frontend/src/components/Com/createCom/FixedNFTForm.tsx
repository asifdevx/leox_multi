import FormInput from "../HelperCom/FormInput";
import { ShortenPrecisionPrice } from "@/utils/ShortenPrecisionPrice";

interface FixedNFTFormProps {
  value: { price: string; fee: number; supply: string };
  setValue: {
    setPrice: (price: string) => void;
    setSupply: (supply: string) => void;
  };
}
const FixedNFTForm = ({
  value: { price, supply, fee },
  setValue: { setPrice, setSupply },
}: FixedNFTFormProps) => {
  return (
    <>
      <FormInput
        label="Price"
        placeholder="Enter price"
        type="text"
        value={price}
        icon="ETH"
        onChange={(e) => {
          let value = e.target.value.replace(/[^0-9.]/g, ""); 
          if ((value.match(/\./g) || []).length > 1) return; 
      
 
          const parts = value.split(".");
          if (parts[1]?.length > 5) parts[1] = parts[1].slice(0, 5); 
          value = parts.join(".");
      
          setPrice(value);
        }}
      />

      {/* Summary Box */}
      <div className="w-full rounded-xl p-4 bg-[#0f1f33] border border-[#1e3350] shadow-inner flex flex-col gap-4">
        <div className="flex justify-between text-gray-400">
          <span>Price</span>
          <span className="text-white">{price ? `${price} ETH` : "-"}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Leox Fee</span>
          <span className="text-white">
            {fee !== null && fee !== undefined ? `${fee}%` : "—"}
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#1e3350]" />
        <div className="flex justify-between text-gray-400">
          <span>You will receive</span>
          <span className="text-[#00d1ff] font-semibold">
            {price && fee !== undefined
              ? `${ShortenPrecisionPrice(
                  (
                    parseFloat(price) -
                    parseFloat(price) * (fee / 100)
                  ).toString()
                )} ETH`
              : "—"}
          </span>
        </div>
      </div>
      <FormInput
        label="Supply"
        placeholder="10"
        type="text"
        value={supply}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9.]/g, "");
          if ((value.match(/\./g) || []).length <= 1) setSupply(value);
        }}
      />
    </>
  );
};

export default FixedNFTForm;
