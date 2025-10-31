import Image from "next/image";
import React from "react";

import { useRouter } from "next/navigation";
import AnimatedBorder from "@/components/ui/MovingBorder";

const HomeBanner = () => {
  const router = useRouter();
  return (
    <div className="relative w-full h-[600px] ">
      {/* Background Image */}
      <Image
        src="/homeBg.png"
        alt="Home background"
        fill
        priority
        className="object-cover blur-sm"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col  px-10 md:flex-row items-center justify-center gap-7 md:gap-14 text-center md:text-left bg-black/40 py-6">
        {/* Left Image */}
        <div className="relative w-full px-10  aspect-square md:lg-w-[25rem] lg:w-[28rem]  rounded-lg overflow-hidden">
          <Image
            src="/bg.png"
            alt="Background small"
            fill
            priority
            className="object-cover pointer-events-none"
          />
        </div>

        {/* Right Text/Data */}
        <div className="text-white space-y-2 max-w-md">
          <h2 className="text-3xl md:text-5xl font-bold">
            The Future of NFTs Starts Here
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            Join a thriving community of artists and collectors redefining
            digital ownership. At Leox, every NFT tells a story — yours starts
            here.
          </p>
          <div className="flex gap-5 w-full items-center sm:items-start flex-col  sm:flex-row mt-8">
            <AnimatedBorder title="Learn More" arrow="&rarr;" buttonClass="text-sm lg:text-xl"/>
            <AnimatedBorder
              title="Create NFT"
              handleClick={() => router.push("/create")}
              arrow="&rarr;"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
