/* eslint-disable @next/next/no-img-element */
"use client";
import {
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
} from "lucide-react";
import { useState } from "react";

// Types for our Product
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  colors: { name: string; hex: string; img?: string }[];
  sizes: string[];
}

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Sakigai Linen Throw Printed Ruffle Pillow",
    price: 78.0,
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1000&auto=format&fit=crop",
    sizes: ['18" x 18"', '20" x 18"', '20" x 20"', "Lumbar"],
    colors: [
      { name: "Charcoal Grid", hex: "#4A4A4A" },
      { name: "Forest Green", hex: "#2D3B2D" },
      { name: "Oatmeal", hex: "#E5D3B3" },
    ],
  },
];

function QuickShopModal({
  product,
  onClose,
}: {
  product?: Product | null;
  onClose: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState(product?.sizes[2]);

  return (
    <div
      className={`
        ${
        product
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 scale-120"
          : "hidden"
      }`}
    >
      <div className="bg-white w-full max-w-[900px] relative flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-gray-400 hover:text-black transition"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        {/* Left Side: Image Gallery */}
        <div className="w-full md:w-[55%] relative group bg-[#F9F9F9]">
          <div className="absolute top-4 right-4 z-10 bg-white/80 px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold">
            <Heart size={12} fill="currentColor" /> 596
          </div>
          <img
            src={product?.image}
            alt=""
            className="w-full h-full object-cover aspect-square md:aspect-auto"
          />

          {/* Gallery Nav */}
          <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition">
            <ChevronLeft size={20} />
          </button>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-[45%] p-8 md:p-10 flex flex-col overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl md:text-2xl font-light leading-tight mb-2 pr-6">
            {product?.name}
          </h2>
          <p className="text-lg font-medium mb-6">
            ${product?.price.toFixed(2)}
          </p>

          <hr className="border-gray-100 mb-6" />

          {/* Color Selection */}
          <div className="mb-6">
            <p className="text-xs mb-3 text-gray-500 uppercase tracking-widest font-semibold">
              Color: <span className="text-black ml-1">Charcoal Grid</span>
            </p>
            <div className="flex gap-3">
              {product?.colors.map((c, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 rounded-full border-2 p-0.5 transition ${
                    i === 0 ? "border-black" : "border-transparent"
                  }`}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              ))}
              <span className="text-[10px] self-center text-gray-400 italic font-serif">
                Forest Green
              </span>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <p className="text-xs mb-3 text-gray-500 uppercase tracking-widest font-semibold">
              Size*
            </p>
            <div className="grid grid-cols-4 gap-2">
              {product?.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-[11px] border transition ${
                    selectedSize === size
                      ? "border-black bg-gray-50"
                      : "border-gray-200 text-gray-500 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty & Add to Cart */}
          <div className="flex gap-2 mb-4">
            <select className="border border-gray-300 px-4 py-3 text-xs appearance-none bg-white min-w-[60px]">
              <option>1</option>
              <option>2</option>
            </select>
            <button className="flex-1 bg-[#4E5B6D] text-white text-[11px] font-bold uppercase tracking-[0.2em] py-4 hover:bg-[#3d4857] transition">
              Add to Basket
            </button>
          </div>

          {/* Payment Badges */}
          <p className="text-[10px] text-gray-500 text-center mb-8 italic">
            4 interest-free installments of $19.50 with{" "}
            <span className="font-bold text-black">Klarna</span> or{" "}
            <span className="bg-black text-white px-1">Pay</span>
          </p>

          <button className="w-full py-4 border border-gray-300 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition">
            View Full Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoryWiseProduct() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 font-sans text-[#222222]">
      {/* Breadcrumbs */}
      <nav className="text-xs mb-8 flex items-center gap-2 text-gray-500">
        <span className="hover:underline cursor-pointer">Décor & Pillows</span>
        <span>/</span>
        <span className="text-black font-medium">Throw Blankets</span>
      </nav>

      {/* Header Section */}
      <div className="flex justify-between items-baseline mb-6">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">
          <span className="heading">Throw Blankets </span>
          <span className="text-xs bottom-0 ml-2 text-gray-400">
            39 products
          </span>
        </h1>

        {/* Desktop Sort - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-gray-500">
            Sort:
          </span>
          <div className="border-b border-black flex items-center gap-8 pb-1 cursor-pointer">
            <span className="text-sm">Featured</span>
            <ChevronDown size={14} />
          </div>
          <div className="flex items-center gap-4 ml-4">
            <ChevronLeft
              size={18}
              className="text-gray-300 cursor-not-allowed"
            />
            <span className="text-xs font-medium">1 / 1</span>
            <ChevronRight size={18} className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-10">
        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-8 border-t border-gray-100 pt-4">
          {["Color", "Price", "Material", "Pattern"].map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-2 text-sm font-medium hover:opacity-60 transition"
            >
              {filter} <ChevronDown size={14} />
            </button>
          ))}
          <button className="flex items-center gap-2 text-sm font-medium border-l pl-8">
            All Filters <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* Mobile Filter Button (Matches your 1st image) */}
        <div className="md:hidden">
          <button className="w-full py-4 border border-gray-200 flex items-center justify-center gap-3 text-sm tracking-wide">
            <SlidersHorizontal size={16} />
            Filter & Sort
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12">
        {/* Sale Banner (First Slot) */}
        <div className="bg-[#E3F2FD] flex flex-col items-center justify-center text-center p-8 aspect-[3/4]">
          <h3 className="text-[#008080] font-serif italic mb-2">
            Bed, Bath & Furniture Event
          </h3>
          <div className="h-[1px] w-8 bg-[#008080] mb-4"></div>
          <p className="text-xs tracking-[0.2em] mb-2 uppercase">Up to</p>
          <h2 className="text-5xl font-light mb-8">30% OFF</h2>
          <button className="bg-white px-8 py-3 text-xs tracking-widest uppercase font-semibold border border-transparent hover:border-black transition">
            Shop Now
          </button>
        </div>

        {/* Product Cards */}
        {PRODUCTS.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />

              {/* Quick Shop Button - Slides up on hover */}
              <button
                onClick={() => setSelectedProduct(product)}
                className="absolute bottom-0 left-0 w-full bg-white/90 py-3 text-[10px] font-bold uppercase tracking-[0.2em] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hover:bg-black hover:text-white"
              >
                Quick Shop
              </button>
            </div>
            <h3 className="text-xs font-medium leading-relaxed mb-1">
              {product.name}
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              ${product.price.toFixed(2)}
            </p>
            <div className="flex gap-1">
              {product.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              <span className="text-[10px] text-gray-400 ml-1">
                {product.colors.length} colors
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* quick shop modal */}
      {/* {selectedProduct && ( */}
      <QuickShopModal
        product={selectedProduct || null}
        onClose={() => setSelectedProduct(null)}
      />
      {/* )} */}
    </div>
  );
}
