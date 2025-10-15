import { AppDispatch, RootState } from "@/components/store/store";
import { fetchNFT } from "@/reducer/nftSlice";
import { NftState } from "@/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation, Pagination } from "swiper/modules";
import Button from "../ui/Button";
import { SkeletonCom } from "./skeleton";

import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SliderItems from "../Com/homeCom/SliderItems";
import { useMediaQuery } from "usehooks-ts";

export default function LatestTransaction() {
  const oneSlider = useMediaQuery("(max-width: 300px)");

  const dispatch = useDispatch<AppDispatch>();
  const { listings, loading, limit } = useSelector(
    (state: RootState) => state.nft as NftState
  );

  const [swiperRef, setSwiperRef] = useState<any>(null);

  useEffect(() => {
    if (listings.length === 0) {
      dispatch(fetchNFT({ start: 0, limit: 10, sortBy: "recent" }));
    }
  }, []);

  return (
    <div className="mx-auto px-0 md:px-4 py-8  text-white ">
      {/* Mobile / Tablet Slider */}
      <div className="block md:hidden relative w-full h-72">
        {/* Custom Buttons */}
        <button
          className={`absolute left-[-8px] xs:top-[31%] top-1/2 -translate-y-1/2 z-10`}
          id="prev-btn"
          onClick={() =>
            swiperRef?.slideTo(
              !oneSlider ? swiperRef.activeIndex - 1 : swiperRef.activeIndex
            )
          }
        >
          <MdOutlineKeyboardArrowRight className="rotate-180" />
        </button>
        <button
          onClick={() =>
            swiperRef?.slideTo(
              !oneSlider ? swiperRef.activeIndex + 1 : swiperRef.activeIndex
            )
          }
          className="absolute right-[-8px] top-1/2 xs:top-[31%] -translate-y-1/2 z-10 "
          id="next-btn"
        >
          <MdOutlineKeyboardArrowRight className="" />
        </button>

        <Swiper
          modules={[Virtual, Navigation, Pagination]}
          onSwiper={setSwiperRef}
          slidesPerView={1}
          spaceBetween={16}
          navigation={{
            prevEl: "#prev-btn",
            nextEl: "#next-btn",
          }}
          virtual
          speed={600}
          breakpoints={{
            300: { slidesPerView: 2, spaceBetween: 10, centeredSlides: false },

            500: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false },
            600: { slidesPerView: 4, spaceBetween: 20, centeredSlides: false },
          }}
          className="w-full h-full transition-transform duration-300"
        >
          {listings.map((item, index) => (
            <SwiperSlide
              key={`${item.tokenId}-${item.seller}-${index}`}
              virtualIndex={index}
              className=" text-white flex items-start justify-center "
            >
              <SliderItems item={item} isDesktop={false} />
            </SwiperSlide>
          ))}
          {loading &&
            listings.length === 0 &&
            Array.from({ length: limit }).map((_, idx) => (
              <SwiperSlide key={idx}>
                <SkeletonCom />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading && listings.length === 0
          ? Array.from({ length: limit }).map((_, idx) => (
              <SkeletonCom key={idx} />
            ))
          : listings.map((item, index) => (
              <div
                key={`${item.tokenId}-${item.seller}-${index}`}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <SliderItems item={item} isDesktop={true} />
              </div>
            ))}
      </div>

      {/* Load More */}
      <div className="w-full flex justify-center items-center mt-8"></div>
    </div>
  );
}
