import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/components/store/store";
import AuctionCollection from "./AuctionCollection";
import FixedCollection from "./FixedCollection";
import { getNftData } from "@/api/api";
import { Poperties } from "@/config/Nft";
import ExpandableText from "@/components/Com/HelperCom/ExpandableText";



export default function NftDetail() {
  const params = useParams<{ tokenId: string; seller: string }>();
  const [fetchedNft, setFetchedNft] = useState<any>(null);

  const nft = useSelector((state: RootState) =>
  state.nft.listings.find(
    (e) =>
      e.tokenId.toString() === params?.tokenId &&
      e.seller.toLowerCase() === params?.seller.toLowerCase()
  )
);

  useEffect(() => {
    if (!nft && params?.tokenId && params?.seller) {
      (async () => {
        const data = await getNftData({
          tokenId: params.tokenId,
          seller: params.seller,
        });
        setFetchedNft(data);
      })();
    }
    
    
  }, [nft, params?.tokenId, params?.seller]);

  const activeNft = nft || fetchedNft;
  if (!activeNft) return <div className="text-white p-8">Loading...</div>;

  const isAuction =
    activeNft.saleType === 1 || activeNft.saleType === "Auction";

  return (
    <div className="relative flex justify-center items-center min-h-screen px-6 py-12 overflow-hidden bg-[#060b1a]">
      {/* Background Lights */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[120px]" />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-6xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_-15px_#9333ea60] grid grid-cols-1 md:grid-cols-2 gap-10 p-8 text-white transition-transform duration-500 hover:scale-[1.01]">
        {/* Left Side - Image + Properties */}
        <div className="flex flex-col gap-8">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg">
            <Image
              src={activeNft.image}
              alt={activeNft.name}
              width={600}
              height={600}
              className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Properties */}
          <div>
            <h3 className="text-lg font-semibold tracking-wide text-gray-300 mb-4">
              PROPERTIES
            </h3>
            <div className="flex flex-wrap gap-3">
              {Poperties.map((prop, i) => (
                <div
                  key={i}
                  className="min-w-[110px] bg-gradient-to-br from-[#1a1f38] to-[#232b4a] border border-[#3b4566] rounded-lg p-3 text-center shadow-md hover:shadow-purple-600/30 transition-all"
                >
                  <p className="text-gray-400 text-xs uppercase font-medium">
                    {prop.trait}
                  </p>
                  <p className="text-white font-bold mt-1 text-sm tracking-wide text-glow-purple">
                    {prop.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="flex flex-col justify-between">
          {/* Title */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 drop-shadow-lg mb-3">
              {activeNft.name} #{params?.tokenId}
            </h1>
            <p className="text-gray-400 mb-8 text-sm md:text-base break-words">
               <ExpandableText text={activeNft.description} maxChars={200} />  
            </p>

            {/* Meta Info */}
            <div className="space-y-3 text-sm mb-8">
              <p>
                <span className="text-gray-400">OWNED BY:</span>{" "}
                <span className="text-purple-400 hover:text-purple-300 break-words transition-colors cursor-pointer">
                  {activeNft.seller}
                </span>
              </p>
              <p>
                <span className="text-gray-400">ARTIST:</span>{" "}
                <span className="text-cyan-400 hover:text-cyan-300 text-glow-purple cursor-pointer">
                  {activeNft.name}
                </span>
              </p>
            </div>
          </div>

          {/* Fixed or Auction */}
          <div className="relative mt-6">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-500/10 blur-xl -z-10"></div>
            {isAuction ? (
              <AuctionCollection nft={activeNft} />
            ) : (
              <FixedCollection nft={activeNft} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
