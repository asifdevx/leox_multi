import HomeDemoLatestNft from "@/components/Com/homrCom/HomeDemoLatestNft";
import HomeBanner from "@/components/HelperCom/HomeBanner";
import LatestTransaction from "@/components/Com/DropCom/LatestTransaction";
import React from "react";

const index = () => {
  return (
    <section className="section_padding w-full flex flex-col gap-5 ">
      <HomeBanner />
      <div className="border border-white/60 rounded-lg ">
        <div className="p-4">
          <h3 className="text-white font-extrabold">Latest Transactions</h3>
          <div className="w-full h-[2px] bg-white/60 rounded-full" />
          <HomeDemoLatestNft/>
        </div>
      </div>
    </section>
  );
};

export default index;
