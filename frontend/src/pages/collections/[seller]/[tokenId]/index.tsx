import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/components/store/store";
import AuctionCollection from "./AuctionCollection";
import FixedCollection from "./FixedCollection";
import { getNftData } from "@/api/api";



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
    <div className="h-fit p-8 flex justify-center items-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute w-[400px] h-[400px] top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full blur-3xl opacity-20" />
        <div className="absolute w-[300px] h-[300px] top-1/4 right-1/4 bg-purple-500 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="glass-container p-8 z-10 rounded-3xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 text-white transform-gpu perspective shadow-2xl transition-transform duration-500 hover:rotate-none">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <div className="relative w-full aspect-square nft-card-glow rounded-2xl overflow-hidden rotate-xz">
            <Image
              src={activeNft.image}
              alt={activeNft.name}
              width={500}
              height={500}
              className="object-cover w-full h-full pointer-events-none"
            />
          </div>

          {/* NFT traits (example) */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 opacity-80">
              PROPERTIES
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { trait: "TRAIT", value: "Fractal" },
                { trait: "TYPE", value: "Generative Art" },
                { trait: "YEAR", value: "EDITOOS" },
                { trait: "EDITION", value: "9/1" },
              ].map((prop, index) => (
                <div
                  key={index}
                  className="bg-[#1f2847] border border-[#3b4566] p-2 rounded-lg text-sm text-center min-w-[100px] shadow-lg"
                >
                  <p className="text-gray-400 uppercase text-xs font-medium">
                    {prop.trait}
                  </p>
                  <p className="text-white font-bold mt-0.5 text-glow-purple">
                    {prop.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col ">
          <h1 className="text-4xl font-extrabold text-glow-purple mb-4">
            {activeNft.name}{" "}#{params?.tokenId}
          </h1>
          <p className="text-gray-400 mb-8 break-words">
            {activeNft.description}
          </p>

          <div className="text-sm space-y-4 mb-8">
            <p>
              <span className="text-gray-400">OWNED BY:</span>{" "}
              <span className="text-purple-400 cursor-pointer text-purple break-words">
                {activeNft.seller} 
              </span>
            </p>
            <p>
              <span className="text-gray-400">ARTIST:</span>{" "}
              <span className="text-purple-400 cursor-pointer text-glow-purple">
                {activeNft.name}
              </span>
            </p>
          </div>

          {/* Auction or Fixed */}
          {isAuction ? (
            <AuctionCollection nft={activeNft} />
          ) : (
            <FixedCollection nft={activeNft} />
          )}
        </div>
      </div>
    </div>
  );
}
