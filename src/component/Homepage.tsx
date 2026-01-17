/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { X, User, ChevronRight, Home } from "lucide-react";
import HomepageBanner from "./Headers/HomepageBanner";
import SeasonalCategory from "./Homepage/SeasonalCategory";
import CategoryNavigation from "./Homepage/CategoryNavigation";
import ShowProductsFlex from "./ProductDisplay/ShowProductsFlex";
import Title from "./Headers/Title";
import HomepageGallery from "./Homepage/HomepageGallery";

export default function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const productImages = [
    {
      title: "Mugs",
      category: "Kitchen",
      imageURL:
        "https://havenly.com/blog/wp-content/uploads/2024/10/kyliefitts_havenly-process_15-3-1500x970.jpg",
    },
    {
      title: "Holiday Decor",
      category: "Seasonal",
      imageURL:
        "https://m.media-amazon.com/images/I/81AutGbQnfL._AC_UF894%2C1000_QL80_.jpg",
    },
    {
      title: "Furniture",
      category: "Home",
      imageURL:
        "https://res.cloudinary.com/dc5ztdzeo/image/upload/c_fill%2Ch_525%2Cw_700%2Cdpr_2.0%2Cf_auto%2Cq_auto/c_lpad%2Cdpr_2.0%2Cf_auto%2Cq_auto/v1/products_fixed/BDSVN01/villa-7pce-natural-hardwood-extendable-dining-set-eco-friendly-beige-fabric%20%287%29.jpg?_i=AB",
    },
    {
      title: "Christmas Trees",
      category: "Holiday",
      imageURL:
        "https://ak1.ostkcdn.com/images/products/is/images/direct/8a7cdd3e66d55669f26010afae928bff8e34c93d/Freestanding-Modern-Minimalist-Bedroom-Wooden-Armoire-Wardrobe.jpg?impolicy=medium",
    },
    {
      title: "Flowers",
      category: "Decor",
      imageURL:
        "https://m.media-amazon.com/images/I/81y0hurPXQL._AC_UF894%2C1000_QL80_.jpg",
    },
    {
      title: "Vases",
      category: "Decor",
      imageURL:
        "https://blog.froy.com/wp-content/uploads/2023/09/Scandinavian-Living-Room-Decor-Featured-Image-1920x1024.png",
    },
    {
      title: "Bedding",
      category: "Bedroom",
      imageURL:
        "https://mobileimages.lowes.com/productimages/cbdfd8b9-1f6a-45eb-bade-cbd7b7ce5b45/15942577.jpg?size=pdhz",
    },
    {
      title: "Art & Mirrors",
      category: "Decor",
      imageURL:
        "https://m.media-amazon.com/images/I/81UnZ6uFHhL._AC_UF894%2C1000_QL80_.jpg",
    },
    {
      title: "Dining",
      category: "Kitchen",
      imageURL:
        "https://ak1.ostkcdn.com/images/products/is/images/direct/958a602775c3b329aa3974b2e4d2524ac3a52019/3PCS-Modern-Couch-Set-Living-Room-Furniture-Set.jpg?impolicy=medium",
    },
    {
      title: "Candles",
      category: "Home",
      imageURL:
        "https://m.media-amazon.com/images/I/81UnZ6uFHhL._AC_UF894%2C1000_QL80_.jpg",
    },
    {
      title: "Plates",
      category: "Kitchen",
      imageURL:
        "https://m.media-amazon.com/images/I/81UnZ6uFHhL._AC_UF894%2C1000_QL80_.jpg",
    },
    {
      title: "Table Settings",
      category: "Dining",
      imageURL:
        "https://m.media-amazon.com/images/I/81UnZ6uFHhL._AC_UF894%2C1000_QL80_.jpg",
    },
    {
      title: "Bedroom",
      category: "Furniture",
      imageURL:
        "https://m.media-amazon.com/images/I/81UnZ6uFHhL._AC_UF894%2C1000_QL80_.jpg",
    },
    {
      title: "Holiday",
      category: "Seasonal",
      imageURL:
        "https://m.media-amazon.com/images/I/81UnZ6uFHhL._AC_UF894%2C1000_QL80_.jpg",
    },
  ];

  const menuItems = [
    "New!",
    "Gifts",
    "Holiday",
    "Furniture",
    "Décor & Pillows",
    "Lighting",
    "Rugs",
    "Art & Mirrors",
    "Kitchen & Dining",
    "Candles",
    "Bedding",
    "Bath",
    "Outdoor",
    "Sale",
  ];

  return (
    <div>
      <div className="min-h-screen bg-white">
        {/* Sale Banner */}
        <HomepageBanner />

        {/* seasonal categories  */}
        <SeasonalCategory />

        {/* larger device gallery */}
        <div className="hidden lg:block">
          <HomepageGallery />
        </div>

        {/* larger device gif */}
        <div className="hidden lg:block py-5">
          <img
            src={"/images/home/homepage-large-image.jpg"}
            alt={"Gallery Heading"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* small device category navigation */}
        <CategoryNavigation />
        {/* More to Explore */}
        <div className="px-4 md:px-12 lg:px-40 py-8">
          <Title title="More to Explore" />
          <ShowProductsFlex />
        </div>
        {/* Recently viewed products */}
        <div className="px-4 md:px-12 lg:px-40 py-8">
          <Title title="Recently Viewed" />
          <ShowProductsFlex />
        </div>
        {/* Side Menu */}
        {/* <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
            menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className={`absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl transform transition-transform ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >*/}
        {/* Menu Header */}
        {/*
            <div className="bg-gray-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                <span className="font-semibold">sakigai.com/an</span>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
*/}
        {/* Menu Content */}
        {/*
            <div className="overflow-y-auto h-full pb-20">
            */}
        {/* Sign In */}
        {/*
              <div className="px-6 py-4 border-b flex items-center gap-3">
                <User className="w-6 h-6 blue-link" />
                <span className="blue-link font-medium">Sign In / Sign Up</span>
              </div>
*/}
        {/* Menu Items */}
        {/* 
              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`px-6 py-4 border-b flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                    ["Gifts", "Holiday", "Sale"].includes(item)
                      ? "text-red-600"
                      : ""
                  }`}
                >
                  <span className={item === "Sale" ? "text-red-600" : ""}>
                    {item}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
