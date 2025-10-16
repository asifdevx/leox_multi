import { AppDispatch, RootState } from "@/components/store/store";
import { fetchNFT } from "@/reducer/nftSlice";
import { NftState } from "@/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Navigation, Pagination } from "swiper/modules";
import Button from "../ui/Button";
import { SkeletonCom } from "./skeleton";
import { FaLongArrowAltRight } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import TransactionsItem from "../Com/DropCom/TransactionsItem";

export default function LatestTransaction() {
  const oneSlider = useMediaQuery("(max-width: 300px)");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
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
      <div className="block md:hidden relative w-full h-fit pt-3">
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
          className="w-full h-full transition-transform duration-300 pt-3"
        >
          {listings.slice(0,10).map((item, index) => (
            <SwiperSlide
              key={`${item.tokenId}-${item.seller}-${index}`}
              virtualIndex={index}
              className=" text-white flex items-start justify-center "
            >
              <TransactionsItem item={item} isDesktop={false} />
            </SwiperSlide>
          ))}
          {loading &&
            listings.length === 0 &&
            Array.from({ length: 10 }).map((_, idx) => (
              <SwiperSlide key={idx}>
                <SkeletonCom />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
        {loading && listings.length === 0
          ? Array.from({ length: limit }).map((_, idx) => (
              <SkeletonCom key={idx} />
            ))
          : listings.slice(0,10).map((item, index) => (
              <div
                key={`${item.tokenId}-${item.seller}-${index}`}
                className=""
              >
                <TransactionsItem item={item} isDesktop={true} />
              </div>
            ))}
      </div>
      

      {/* Load More */}
      <Button othercss="w-full flex justify-center items-center mt-8 hover:scale-100 bg-gray-600 text-white focus:bg-gray-700" title="More NFTS" handleClick={()=>router.push("/drops")} icon={<FaLongArrowAltRight/>} />

      
    </div>
  );
}
