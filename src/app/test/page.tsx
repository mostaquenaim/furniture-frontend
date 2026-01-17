import BannerManager from "@/component/admin/BannerManager";
import Footer from "@/component/Footer/Footer";
import HeaderDS from "@/component/Headers/HeaderDS";
import PromoBannerContainer from "@/component/Headers/PromoBannerContainer";
import { User } from "lucide-react";
import React from "react";

const test = () => {
  return (
    <div>
      {/* <PromoBannerContainer /> */}
      <BannerManager initialBanners={[]} token={""}></BannerManager>
      <Footer></Footer>
    </div>
  );
};

export default test;
