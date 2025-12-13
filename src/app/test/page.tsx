import BannerManager from "@/component/admin/BannerManager";
import Header from "@/component/Headers/HeaderDS";
import PromoBannerContainer from "@/component/Headers/PromoBannerContainer";
import React from "react";

const test = () => {
  return (
    <div>
      {/* <PromoBannerContainer /> */}
      <Header></Header>
      <BannerManager initialBanners={[]} token={""}></BannerManager>
    </div>
  );
};

export default test;
