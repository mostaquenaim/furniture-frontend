/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";

// Mock data
const BLOG_POSTS = [
  {
    id: 1,
    title: "Gifts for Health and Wellness Lovers",
    subtitle: "Find the best gift for your favorite self-care specialist.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr-b2YJVPQW2hmI6jEIMrBg6oVrkaFclHt1w&s",
  },
  {
    id: 2,
    title: "The BEAUTY FAVES Team Anthro Is Loving Right Now",
    subtitle: "These always earn a spot in our beauty bag.",
    image:
      "https://funky-chunky-furniture.co.uk/cdn/shop/files/Sandyford_Scandi_Coffee_Tablesquare_2040x2040.jpg?v=1692266394",
  },
  {
    id: 3,
    title: "Double Cleansing 101",
    subtitle: "Let us give you the 411 on this buzzy skincare step.",
    image: "https://m.media-amazon.com/images/I/31XRSuRli5L._AC_US750_.jpg",
  },
];

const CATEGORIES = [
  "Fashion & Style",
  "Home & Garden",
  "Beauty & Wellness",
  "Weddings",
  "Behind the Brand",
  "Anthro Impact",
  "Gift Guides",
];

export default function AllBlogsComponent() {
  const [activeCategory, setActiveCategory] = useState("Beauty & Wellness");

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-10 py-10 min-h-screen font-serif">
      {/* Header Section */}
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 text-[#b2965d] uppercase tracking-widest text-xs mb-2">
          <span className="border-b border-[#b2965d] pb-0.5">A</span>
          <span>
            stories:{" "}
            <span className="italic lowercase font-normal">
              {activeCategory.split(" ")[0].toLowerCase()}
            </span>
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl tracking-[0.2em] uppercase font-light text-gray-800 mb-4">
          Beauty, Wellness, and Skincare Tips
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto italic font-sans text-sm md:text-base leading-relaxed">
          Feel your best – inside & out – with these self-care tips &
          get-glowing tricks.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Sidebar / Mobile Dropdown */}
        <aside className="lg:w-1/5">
          {/* Mobile "Shop by Category" Dropdown */}
          <div className="lg:hidden mb-8">
            <select
              className="w-full border border-gray-300 bg-white p-4 text-sm tracking-wide appearance-none cursor-pointer"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              <option disabled>Shop by Category</option>
              {CATEGORIES?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Sidebar List */}
          <nav className="hidden lg:block space-y-3 border-t border-gray-200 pt-6">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">
              Browse by:
            </p>
            <p className="text-sm font-semibold mb-6">Stories</p>
            <ul className="space-y-3 text-[13px] tracking-wide text-gray-700">
              {CATEGORIES?.map((cat) => (
                <li
                  key={cat}
                  className={`cursor-pointer hover:underline ${
                    activeCategory === cat
                      ? "text-teal-700 font-medium underline underline-offset-4"
                      : ""
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Blog Main Grid */}
        <main className="lg:w-4/5">
          <div className="border-t border-gray-200 pt-4 mb-8">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-800 font-bold">
              Beauty Guides
            </h2>
          </div>

          {/* Grid: 1 col on mobile, 3 cols on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
            {BLOG_POSTS?.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <div className="aspect-4/5 overflow-hidden mb-5">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg md:text-xl text-gray-800 border-b border-gray-800 inline-block mb-3 pb-0.5 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 font-sans italic leading-relaxed">
                  {post.subtitle}
                </p>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
