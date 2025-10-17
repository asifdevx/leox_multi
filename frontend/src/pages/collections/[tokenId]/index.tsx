import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";

export default function NftDetail() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);

  const nft = useSelector((state: RootState) =>
    state.nft.listings.find((e) => e.tokenId == params?.tokenId)
  );

  if (!nft) notFound();
  const isAuction = nft.saleType === 1;

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    progress: 0,
  });

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= nft.remainingSupply) setQuantity(newQty);
  };

  const totalPrice = Number(nft.price) * quantity;

  useEffect(() => {
    if (!isAuction) return;

    const endTime = new Date(nft.auctionEndTime).getTime();
    const totalDuration = endTime - Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, progress: 100 });
        return;
      }

      const hours = Math.floor(remaining / 1000 / 60 / 60);
      const minutes = Math.floor((remaining / 1000 / 60) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      const progress = ((totalDuration - remaining) / totalDuration) * 100;

      setTimeLeft({ hours, minutes, seconds, progress });
    }, 1000);

    return () => clearInterval(timer);
  }, [nft.auctionEndTime, isAuction]);

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
              src={nft.image}
              alt={nft.name}
              width={500}
              height={500}
              className="object-cover w-full h-full"
            />
          </div>

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
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold text-glow-purple mb-4">
            {nft.name}
          </h1>
          <p className="text-gray-400 mb-8 max-w-lg">{nft.description}</p>

          <div className="text-sm space-y-1 mb-8">
            <p>
              <span className="text-gray-400">OWNED BY:</span>{" "}
              <span className="text-purple-400 cursor-pointer text-glow-purple">
                {nft.owner}
              </span>
            </p>
            <p>
              <span className="text-gray-400">ARTIST:</span>{" "}
              <span className="text-purple-400 cursor-pointer text-glow-purple">
                {nft.name}
              </span>
            </p>
          </div>

          {/* Auction Section */}
          {isAuction ? (
            <div className="bg-[#151c36] p-6 rounded-xl border border-purple-800/50 mb-8 shadow-xl">
              <p className="text-sm text-gray-400 uppercase font-medium mb-2">
                AUCTION ENDS IN:
              </p>
              <h2 className="text-3xl font-bold text-glow-purple mb-4">
                {timeLeft.hours.toString().padStart(2, "0")}:
                {timeLeft.minutes.toString().padStart(2, "0")}:
                {timeLeft.seconds.toString().padStart(2, "0")}
              </h2>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-[#1f2847] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${timeLeft.progress}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 text-right">
                {Math.floor(timeLeft.progress)}% completed
              </p>

              <button className="neon-button bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg mt-4">
                PLACE BID
              </button>
            </div>
          ) : (
            <>
              {/* Fixed Price Section */}
              {/* Fixed Price Section */}
              <div className="bg-[#151c36] p-6 rounded-xl border border-purple-800/50 mb-8 shadow-xl space-y-4">
                <p className="text-sm text-gray-400 uppercase font-medium">
                  FIXED PRICE:
                </p>
                <h2 className="text-3xl font-bold mt-1 text-glow-purple">
                  {nft.price} ETH
                </h2>
                <p className="text-gray-400 text-sm">
                  ($
                  <span className="text-green-400">
                    {Number(nft.price) * 3000}
                  </span>
                  )
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">Quantity:</span>
                  <div className="flex items-center border border-purple-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-[#1f2847] text-white font-medium w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-400">
                    / {nft.remainingSupply} available
                  </span>
                </div>

                {/* Total Price */}
                <p className="text-white font-bold text-lg">
                  Total:{" "}
                  <span className="text-glow-purple">
                    {totalPrice.toFixed(4)} ETH
                  </span>
                </p>

                {/* Buy Now Button */}
                <div className="flex flex-col space-y-4">
                  <button className="neon-button bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg">
                    BUY {quantity} NFT{quantity > 1 ? "s" : ""} FOR{" "}
                    {totalPrice.toFixed(4)} ETH
                  </button>
                  <button className="text-purple-400 hover:text-white transition font-medium py-3 flex items-center justify-center space-x-2">
                    <span>VIEW HISTORY</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
