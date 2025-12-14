import BannerManager from "@/component/admin/BannerManager";
import Footer from "@/component/Footer/Footer";
import Header from "@/component/Headers/HeaderDS";
import PromoBannerContainer from "@/component/Headers/PromoBannerContainer";
import { User } from "lucide-react";
import React from "react";

const test = () => {
  return (
    <div>
      {/* <PromoBannerContainer /> */}
      <Header></Header>
      <BannerManager initialBanners={[]} token={""}></BannerManager>
      {/* <p className="blue-link flex gap-2">
        <User></User> Sign in / Sign up
      </p> */}
      <Footer></Footer>
    </div>
  );
};

export default test;
