"@web3modal/wagmi": "^5.1.11",
   "wagmi": "^2.12.17"

  yarn add wagmi viem@2.x @tanstack/react-query @wagmi/vue
  yarn add @wagmi/vue


editor.parameterHints.enabled





import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";

// Mock Data (For demonstration)
const mockNft = {
  tokenId: "47",
  // IMPORTANT: Replace with an actual image path/URL
  image: "https://via.placeholder.com/500x500/0a0f1e/ffffff?text=Quantum+Bloom", 
  name: "Quantum Bloom #047",
  description: "A procedurally generated digital sculpture exploring recursive pattern and evolution. Minted as 1/1 digital artifact.",
  owner: "0xABDCo...1234",
  artist: "SybillSynth",
  fixedPriceEth: "7.5",
  fixedPriceUsd: "12,000",
  auctionEnds: "8h 45m 12s",
  properties: [
    { trait: "TRAIT", value: "Fractal" },
    { trait: "TYPE", value: "Generative Art" },
    { trait: "YEAR", value: "EDITOOS" },
    { trait: "EDITION", value: "9/1" },
  ],
  saleType: "FIXED_PRICE", 
};


export default function NftDetail() {
  const params = useParams();
  
  // Replace this with your actual Redux or data fetching logic
  // const nft = useSelector((state:RootState)=>state.nft.listings.find((e)=>e.tokenId==params?.tokenId));
  const nft = mockNft; 

  if(!nft) notFound();
    
  const isAuction = nft.saleType === 'AUCTION';

  return (
    // 1. Parent container with PERSPECTIVE for 3D effect
    <div className="min-h-screen p-8 flex justify-center items-center bg-[#0d1222] relative overflow-hidden perspective-lg">
      
      {/* Background radial-gradient overlay */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute w-[400px] h-[400px] top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute w-[300px] h-[300px] top-1/4 right-1/4 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* 2. Main Glassmorphic Container with ANGLE/ROTATION */}
      {/* Classes: glass-container (custom CSS for backdrop-filter/border) 
           transform-gpu (performance) 
           rotate-x-3 & rotate-z-1 (custom CSS for the angle) */}
      <div 
        className="glass-container p-8 z-10 rounded-3xl w-full max-w-5xl 
                   grid grid-cols-1 lg:grid-cols-2 gap-12 text-white
                   transform-gpu rotate-x-3 rotate-z-1 shadow-2xl 
                   transition-transform duration-500 hover:rotate-0"
      >
        
        {/* Left Column: NFT Image and Properties */}
        <div className="flex flex-col gap-8">
          
          {/* NFT Image Container with NEON GLOW */}
          <div className="relative w-full aspect-square nft-card-glow rounded-2xl overflow-hidden">
            <Image
              src={nft.image}
              alt={nft.name}
              width={500}
              height={500}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Properties Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 opacity-80">PROPERTIES</h3>
            <div className="flex flex-wrap gap-2">
              {nft.properties.map((prop, index) => (
                <div key={index} className="bg-[#1f2847] border border-[#3b4566] p-2 rounded-lg text-sm text-center min-w-[100px] shadow-lg">
                  <p className="text-gray-400 uppercase text-xs font-medium">{prop.trait}</p>
                  {/* Property values use TEXT GLOW */}
                  <p className="text-white font-bold mt-0.5 text-glow-purple">{prop.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Details and Actions */}
        <div className="flex flex-col">
          
          {/* Navigation/Search Mock */}
          <div className="flex justify-end items-center space-x-6 text-gray-300 font-medium mb-12 border-b border-gray-700/50 pb-4">
            <span className="cursor-pointer text-white font-bold border-b-2 border-purple-500 pb-1">Explore</span>
            <span className="cursor-pointer hover:text-white transition">Drops</span>
            <span className="cursor-pointer hover:text-white transition">Profile</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-4 text-gray-400 hover:text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          {/* NFT Header Details */}
          {/* Title uses TEXT GLOW */}
          <h1 className="text-4xl font-extrabold text-glow-purple mb-4">{nft.name}</h1>
          <p className="text-gray-400 mb-8 max-w-lg">{nft.description}</p>
          
          <div className="text-sm space-y-1 mb-8">
            <p><span className="text-gray-400">OWNED BY:</span> <span className="text-purple-400 cursor-pointer text-glow-purple">{nft.owner}</span></p>
            <p><span className="text-gray-400">ARTIST:</span> <span className="text-purple-400 cursor-pointer text-glow-purple">{nft.artist}</span></p>
          </div>

          {/* Price/Bid Section */}
          <div className="bg-[#151c36] p-6 rounded-xl border border-purple-800/50 mb-8 shadow-xl">
            <p className="text-sm text-gray-400 uppercase font-medium">FIXED PRICE:</p>
            {/* Price uses TEXT GLOW */}
            <h2 className="text-3xl font-bold mt-1 text-glow-purple">{nft.fixedPriceEth} ETH</h2>
            <p className="text-gray-400 text-sm">($<span className="text-green-400">{nft.fixedPriceUsd}</span>)</p>
            
            {/* Countdown Bar */}
            <div className="h-2 w-full bg-[#1f2847] rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 w-[60%] rounded-full"></div>
            </div>
            <p className='text-xs text-gray-400 mt-2 text-right'>5h 45m 12s</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            {/* Button uses NEON GLOW and hover transform */}
            <button className="neon-button bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg">
              BUY NOW FOR {nft.fixedPriceEth} ETH
            </button>
            <button className="text-purple-400 hover:text-white transition font-medium py-3 flex items-center justify-center space-x-2">
              <span>VIEW HISTORY</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}