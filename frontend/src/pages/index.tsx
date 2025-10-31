
import HomeBanner from "@/components/Com/HelperCom/HomeBanner";
import LatestTransaction from "@/components/ui/nftSlider";

import React from "react";

const index = () => {
  return (
    <section className="section_padding w-full flex flex-col gap-8 ">
      <HomeBanner />
      <div className="border-none md:border-solid border border-[#2d5489] rounded-lg ">
        <div className=" py-4 md:py-0 md:p-4">
          <h3 className="text-white text-xl sm:text-2xl md:text-3xl/[2rem] font-extrabold py-3 md:py-5">Recent Transaction</h3>
          <div className="w-full h-[2px] bg-white/10 mt-2 rounded-full" />
          <LatestTransaction/>
        </div>
      </div>
    </section>
  );
};

export default index;
