/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useFetchHomepageBanners from "@/hooks/Banner/useFetchHomepageBanners";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "../admin/Banner/AllHomepageBannersComp";

const HomepageBanner = () => {
  const { banners, isLoading } = useFetchHomepageBanners(true);

  if (isLoading) {
    return (
      <div className="w-full my-5">
        <div className="w-full aspect-4/1 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!banners || banners.length === 0) return null;

  return (
    <div className="w-full my-5">
      {banners.map((banner: Banner) => (
        <Link key={banner.id} href={banner?.link || "/"} className="block">
          {/* Mobile */}
          <div
            className={`relative ${banner.device === "MOBILE" ? "block md:hidden" : "hidden"} w-full aspect-square`}
          >
            <Image
              src={banner.image}
              alt={banner.title || "Banner"}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Desktop */}
          <div
            className={`relative ${banner.device === "DESKTOP" ? "hidden md:block" : "hidden"} w-full aspect-4/1`}
          >
            <Image
              src={banner.image}
              alt={banner.title || "Banner"}
              fill
              priority
              className="object-cover"
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HomepageBanner;
