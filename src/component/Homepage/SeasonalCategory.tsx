import Image from "next/image";
import Link from "next/link";
import React from "react";

const seasonalCategories = [
  {
    id: 1,
    image: "/images/seasonal/in-stock-image.webp",
    href: "/category/summer",
  },
  {
    id: 2,
    image: "/images/seasonal/in-stock-image.webp",
    href: "/category/winter",
  },
  {
    id: 3,
    image: "/images/seasonal/in-stock-image.webp",
    href: "/category/eid",
  },
  {
    id: 4,
    image: "/images/seasonal/in-stock-image.webp",
    href: "/category/puja",
  },
  {
    id: 5,
    image: "/images/seasonal/in-stock-image.webp",
    href: "/category/autumn",
  },
  {
    id: 6,
    image: "/images/seasonal/in-stock-image.webp",
    href: "/category/spring",
  },
];

const SeasonalCategory = () => {
  return (
    <div className="w-full px-4 my-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 lg:gap-10">
        {seasonalCategories.map((item) => (
          <Link key={item.id} href={item.href}>
            <div className="relative w-full aspect-3/1 overflow-hidden rounded-md cursor-pointer">
              <Image
                src={item.image}
                alt="Seasonal Category"
                fill
                className="object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SeasonalCategory;
