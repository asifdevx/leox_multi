import { ReactNode } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}



declare type CreateNFTArgs = {
  tokenURI: string;
  supply: number;
  price: number; // in ETH or wei
};






declare type customBtnProps = {
  title: string;
  othercss: string;
  handleclick?: () => void;
  isLink?: boolean;
  linkUrl: string;
  icon?: string;
};
interface InputProps  {
  placeholder: string;
  name?: string;
  type: string;
  inputClass?:string,
  iconClass?:string,
  value?: string | number;
  position?:"left" | "right",
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode | string;
};


type FormInputProps = {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  icon?: string;
  inputClass?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export interface ListedItemView {
  tokenId: number;
  creator: string;
  seller: string;
  price: string;
  supply: string;
  remainingSupply: number;
  isListed: boolean;
  saleType: number;
  auctionEndTime: number;
  highestBidder: string;
  highestBid: string;
  claimed: boolean;
  name:string,
description:string,
image:string
}


interface NftState {
  listings: ListedItemView[];
  fee:number | undefined;
  loading: boolean;
  error: string | null;
  hasMore: boolean;    
  page: number;      
  limit: number;       
}
interface MobileSideBar {
  open:boolean,
  setOpen:Dispatch<SetStateAction<boolean>>
}
declare type SearchBarProps={
  search:boolean,
  setSearchBar:Dispatch<SetStateAction<boolean>>
}
interface PreviewNFTProps{
  preview: string | null;
   name:string;
   price: string;
}