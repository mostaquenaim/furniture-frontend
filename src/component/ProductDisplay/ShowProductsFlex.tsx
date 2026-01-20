import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Product } from "@/types/product.types";
import Image from "next/image";

type ShowProductType = {
  maxWidth?: string;
  products?: Product[];
};

const ShowProductsFlex = ({ maxWidth, products }: ShowProductType) => {
  return (
    <div className={`${maxWidth && maxWidth} relative`}>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        slidesPerView={1.5}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2.5,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 16,
          },
        }}
        loop={true}
        className="pb-12!"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8]?.map((i) => (
          <SwiperSlide key={i}>
            <div className="group cursor-pointer">
              <div className="aspect-3/4 bg-gray-100 mb-3 overflow-hidden">
                <Image
                  alt="Product Image"
                  width={260}
                  height={350}
                  src={"/images/260X350/260X350.jpeg"}
                />
                {/* <div className="w-full h-full bg-gray-200 group-hover:bg-gray-300 transition-colors" /> */}
              </div>
              <h3 className="text-[11px] font-medium leading-tight mb-1">
                Recommended Item {i}
              </h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev-custom absolute left-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button className="swiper-button-next-custom absolute right-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <style jsx>{`
        .swiper-pagination {
          bottom: 0 !important;
        }
        .swiper-pagination-bullet {
          background: #262626;
          opacity: 0.3;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ShowProductsFlex;
