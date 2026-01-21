"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Summer Dress",
    image: "/images/products/p1.webp",
    slug: "summer-dress-1",
  },
  {
    id: 2,
    name: "Winter Jacket",
    image: "/images/products/p2.webp",
    slug: "winter-jacket",
  },
  {
    id: 3,
    name: "Casual Shirt",
    image: "/images/products/p3.webp",
    slug: "casual-shirt",
  },
  {
    id: 4,
    name: "Formal Pants",
    image: "/images/products/p4.webp",
    slug: "formal-pants",
  },
  {
    id: 5,
    name: "Eid Kurta",
    image: "/images/products/p5.webp",
    slug: "eid-kurta",
  },
];

const HomepageGallery = () => {
  // Triple the items to ensure a seamless loop on larger screens
  const marqueeItems = [...products, ...products, ...products];

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
          {marqueeItems?.map((product, index) => (
            <Link
              href={`/product/${product.slug}`}
              key={`${product.id}-${index}`}
              className="inline-flex flex-col items-center mx-6 transition-transform duration-300 hover:scale-105"
              style={{ minWidth: "220px" }}
            >
              {/* Image Card */}
              <div className="relative w-full aspect-3/5 overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-xl">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>

              {/* Typography */}
              <p
                // onClick={() => handleProductClick(product.slug)}
                className="mt-2 text-sm font-medium text-center text-gray-800 cursor-pointer border-b hover:border-none"
              >
                {product.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageGallery;
