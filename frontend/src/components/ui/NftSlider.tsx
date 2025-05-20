import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";

const imageUrls = [
  { img: "/nft_1.png" },
  { img: "/nft_2.png" },
  { img: "/nft_1.png" },
  { img: "/nft_2.png" },
];

const ImageSlider = () => {
  return (
    <Splide
      options={{
        type: "loop",
        autoplay: true,
        interval: 2000,
        pauseOnHover: true,
        drag: "free",
        perPage: 1,
        gap: "1rem",
        arrows: false,
        pagination: true,
      }}
    >
      {imageUrls.map((item, idx) => (
        <SplideSlide key={idx}>
          <Image src={item.img} alt={`NFT Slide ${idx + 1}`} width={600} height={600} className="w-full  h-auto" />
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default ImageSlider;
