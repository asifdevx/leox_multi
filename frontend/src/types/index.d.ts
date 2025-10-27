import React, { ReactNode } from "react";
import { IconType } from "react-icons";

// ====================================================
//                  GLOBAL DECLARATIONS
// ====================================================

declare global {
  interface Window {
    ethereum?: any;
  }
}

// ====================================================
//                    NFT & MINTING
// ====================================================

declare type CreateNFTArgs = {
  tokenURI: string;
  supply: number;
  price: number; // in ETH or wei
  saleType:"Fixed" | "Auction";
  auctionDuration:number;
};

interface NFT {
  tokenId: string;
  name: string;
  description: string;
  username:string;
  image: string;
  seller: string;
  owner: string;
  price: string;
  supply: string;
  remainingSupply: number;
  isListed: boolean;
  saleType: number;
  auctionStartTime: number;
  auctionEndTime: number;
  highestBidder: string;
  highestBid: string;
  claimed: boolean;
  updatedAt:string,
}

interface NftState {
  listings: NFT[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  offset: number;
  limit: number;
  sortBy?: "highestPrice" | "lowestPrice" | "recent" | "oldest";
}

interface PreviewNFTProps {
  preview: string | null;
  name: string;
  price: string;
  activeTab:"Auction" | "Fixed";
  supply:string
}

// ====================================================
//                    UI COMPONENTS
// ====================================================

declare type customBtnProps = {
  title: React.ReactNode;
  othercss: string;
  handleClick?: () => void;
  loading?: boolean;
  isLink?: boolean;
  linkUrl?: string;
  icon?: ReactNode;
  iconClass?:string
};

interface InputProps {
  placeholder: string;
  name?: string;
  type: string;
  inputClass?: string;
  iconClass?: string;
  value?: string | number;
  position?: "left" | "right";
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode | string;
  onFocus?:()=>void
}

type FormInputProps = {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  icon?: string;
  inputClass?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?:()=>void
};

type SideBarItem = {
  label: string;
  route: string;
  imgURL?: string;
  islink?: boolean;
};

interface MobileSideBarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  items: SideBarItem[];
  icon: boolean;
  position: "right" | "left";
  title: string;
  footer?: React.ReactNode;
}

declare type SearchBarProps = {
  search: boolean;
  setSearchBar: Dispatch<SetStateAction<boolean>>;
};

// ====================================================
//                  USER & AUTH / ROLES
// ====================================================

export type Role = "Admin" | "Moderator"  | "Seller" | "Buyer"| "Ban"; // Added "Ban" role


declare type UserInfoType = {
  address: string;
  name?: string;
  gmail?: string | null;
  roles?: Role[];
  isFirstTime?: boolean;
  follower?:number;
  following?:number;

};

interface AddUserNameProps {
  setIsFirstTimeLogin: (isFirstTimeLogin: boolean) => void;
  isFirstTimeLogin: boolean;
}


// ---------------------- USER PROFILE   ------------------------
type NftData ={
  tokenId:string,name:string,image:string,price:string,
}

interface ProfileData {
  user : {name:string,address:string,roles:Role[],follower:number,following:number},
  nfts: {
    owned:NftData[],
    sale:NftData[],
    created:NftData[],
    sold:NftData[],
  }
}

interface ProfilePageProps {
  username?:string,
  
}

interface UserProfileState {
  cache: Record<string, ProfileData>;
  current: ProfileData | null;
  loading: boolean;
  error: string | null;
}
// ---------------------- ADMIN / ROLE ------------------------

interface User {
  name: string;
  address: string;
}

interface UsersState {

  usersByRole: Record<string, User[]>;
  loading: boolean;
  error: string | null;
}

// ====================================================
//                       FEES
// ====================================================

declare type FeeSliderProps = {
  value: number;
  setValue: (value: number) => void;
};

interface ShowConfirmationProps {
  value: number;
  setShowConfirmation: (showConfirmation: boolean) => void;
  handleClick: () => void;
  loading: boolean;
}

interface FeeHistoryItem {
  fee: number;
  updateAt: String;
  txHash?: string | null;
}

interface FeeState {
  status: "idle" | "succeeded";
  history: FeeHistoryItem[];
}
// ====================================================
//                       HOME
// ====================================================


type AnimatedBorderProps = {
  title: string;
  arrow?: string;
  borderRadius?: string;
  handleClick?: () => void;
  type?: "button" | "submit" | "reset";  
  buttonClass?:string
}


interface BuyTokenProps {
  tokenId: number;
  seller: string;
  quantity: number;
  totalPrice: number; // in ETH
}
interface BidTokenProps {
  tokenId: number;
  seller: string;
  bidder:string;
  bidAmount: number; // in ETH
}

type Bid = {
  bidder: string;
  bid: string; // store as string to handle large numbers safely
};

type BidHistory={
  [tokenId:string]:{[seller:string]:Bid[]}
}


type BuyInitialStateProps = {
  bidHistory: Record<string, Record<string, t.getBidsProps[]>>;
  loading: boolean;
  error: string | null;
};
type SingleBids={
  bidder:string;
  bid:string;
  claim:boolean;
  txHash:string;
  createdAt:string
}
interface getBidsProps {
  tokenId:string;
  seller:string;
 bids:SingleBids[];
}

