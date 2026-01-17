/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/navigation";

const HomepageGallery = () => {
  const router = useRouter();

  // Sample product data - replace with your actual data
  const products = [
    {
      id: 1,
      name: "Summer Dress",
      image: "/images/products/p1.jpg",
      slug: "summer-dress-1",
    },
    {
      id: 2,
      name: "Winter Jacket",
      image: "/images/products/p2.jpg",
      slug: "winter-jacket",
    },
    {
      id: 3,
      name: "Casual Shirt",
      image: "/images/products/p3.jpg",
      slug: "casual-shirt",
    },
    {
      id: 4,
      name: "Formal Pants",
      image: "/images/products/p4.jpg",
      slug: "formal-pants",
    },
    {
      id: 5,
      name: "Eid Kurta",
      image: "/images/products/p5.jpg",
      slug: "eid-kurta",
    },
  ];

  const handleProductClick = (slug: string) => {
    router.push(`/product/${slug}`);
  };

  return (
    <div className="py-6 overflow-hidden hidden lg:block">
      <img
        src={"/images/heading/gallery-heading-photo.webp"}
        alt={"Gallery Heading"}
        className="w-full h-full object-cover"
      />
      {/* Marquee container */}
      <div className="relative flex overflow-x-hidden">
        {/* First marquee */}
        <div className="flex animate-marquee whitespace-nowrap py-2">
          {products.concat(products).map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="inline-flex flex-col items-center mx-3"
              style={{ minWidth: "180px" }} // Adjust width as needed
            >
              {/* Image container with 3:5 ratio */}
              <div className="relative w-full" style={{ aspectRatio: "3/5" }}>
                <img
                  onClick={() => handleProductClick(product.slug)}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer"
                />
              </div>
              {/* Product name */}
              <p
                onClick={() => handleProductClick(product.slug)}
                className="mt-2 text-sm font-medium text-center text-gray-800 cursor-pointer border-b hover:border-none"
              >
                {product.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomepageGallery;
