"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import useFetchHomepageGallery from "@/hooks/Homepage/Gallery/useFetchHomepageGallery";

const HomepageGallery = () => {
  const { items, isLoading } = useFetchHomepageGallery(true); // onlyActive=true

  // Triple for seamless marquee loop
  const marqueeItems = [...items, ...items, ...items];

  if (isLoading || items.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 overflow-hidden hidden lg:block">
      <div className="container mx-auto px-4">
        <div className="relative w-full h-24 md:h-32">
          <Image
            src="/images/heading/gallery-heading-photo.webp"
            alt="Our Collection"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Marquee Wrapper */}
      <div className="group relative flex overflow-x-hidden border-y border-gray-100 bg-white py-8">
        <div className="flex animate-marquee whitespace-nowrap group-hover:pause-animation">
          {marqueeItems.map((item, index) => (
            <Link
              href={`/product/${item.slug}`}
              key={`${item.id}-${index}`}
              className="inline-flex flex-col items-center mx-6 transition-transform duration-300 hover:scale-105"
              style={{ minWidth: "220px" }}
            >
              {/* Image Card */}
              <div className="relative w-full aspect-[3/5] overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>

              {/* Label */}
              <p className="mt-2 text-sm font-medium text-center text-gray-800 cursor-pointer border-b hover:border-none">
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageGallery;
