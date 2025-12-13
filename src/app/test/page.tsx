import BannerManager from "@/component/admin/BannerManager";
import Footer from "@/component/Footer/Footer";
import Header from "@/component/Headers/HeaderDS";
import PromoBannerContainer from "@/component/Headers/PromoBannerContainer";
import React from "react";

const test = () => {
  return (
    <div>
      {/* <PromoBannerContainer /> */}
      <Header></Header>
      <BannerManager initialBanners={[]} token={""}></BannerManager>
      <Footer></Footer>
    </div>
  );
};

export default test;
