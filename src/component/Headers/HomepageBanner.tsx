import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomepageBanner = () => {
  return (
    <div className="w-full my-5">
      {/* Mobile banner (1:1) */}
      <Link
        href={"/"}
        className="relative block md:hidden w-full aspect-square"
      >
        <Image
          src="/images/banner-mobile.jpg"
          alt="Homepage Banner"
          fill
          priority
          className="object-cover"
        />
      </Link>

      {/* Desktop banner (1:4) */}
      <Link href={"/"} className="relative hidden md:block w-full aspect-4/1">
        <Image
          src="/images/banner-desktop.jpg"
          alt="Homepage Banner"
          fill
          priority
          className="object-cover"
        />
      </Link>
    </div>
  );
};

export default HomepageBanner;
