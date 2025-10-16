
import HomeBanner from "@/components/HelperCom/HomeBanner";
import LatestTransaction from "@/components/ui/nftSlider";

import React from "react";

const index = () => {
  return (
    <section className="section_padding w-full flex flex-col gap-8 ">
      <HomeBanner />
      <div className="border-none md:border-solid border border-white/60 rounded-lg ">
        <div className=" py-4 md:py-0 md:p-4">
          <h3 className="text-white text-2xl sm:text-3xl md:text-5xl/[2.75rem] font-extrabold py-3 md:py-5">Recent Transaction</h3>
          <div className="w-full h-[2px] bg-white/10 mt-2 rounded-full" />
          <LatestTransaction/>
        </div>
      </div>
    </section>
  );
};

export default index;
