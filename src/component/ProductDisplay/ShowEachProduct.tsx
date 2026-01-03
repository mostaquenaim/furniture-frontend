/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useMemo, useState } from "react";
import {
  Star,
  ChevronRight,
  ChevronLeft,
  Heart,
  Truck,
  Store,
  Facebook,
  Twitter,
  Instagram,
  Plus,
} from "lucide-react";
import { useParams } from "next/navigation";
import useFetchAProduct from "@/hooks/useFetchAProduct";
import LoadingDots from "../Loading/LoadingDS";
import { Review } from "@/types/product.types";

interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  ratingCount: number;
}

const ReviewsSection = (reviewsData: ReviewsData) => {
  console.log(reviewsData, "reviewsData");
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 text-[#262626]">
      {/* Header */}
      <div className="flex justify-between items-baseline border-b border-gray-100 pb-4 mb-0">
        <h2 className="text-[18px] font-normal">Ratings & Reviews</h2>
        <button className="text-[11px] font-medium underline uppercase tracking-widest">
          Write a Review
        </button>
      </div>

      {/* Summary Box */}
      <div className="flex flex-col items-center py-10 bg-[#f9f8f6] mb-10">
        <p className="text-[13px] mb-2 font-light">
          {reviewsData.averageRating || 0} stars <span className="mx-1">|</span>{" "}
          {reviewsData.ratingCount || 0}
          Reviews
        </p>
        <div className="flex gap-0.5 text-[#eeb012]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill="currentColor" stroke="none" />
          ))}
        </div>
      </div>

      {/* Filters Row */}
      <div className="mb-12">
        <h3 className="text-[13px] font-medium mb-3">Filter Reviews</h3>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] block mb-1">Star Rating</label>
            <select className="border border-gray-300 rounded-sm px-3 py-2 text-[13px] w-64 outline-none focus:border-gray-500">
              <option>5 Star</option>
            </select>
          </div>
          <button className="text-[11px] underline text-teal-700 block">
            Reset All Filters
          </button>
        </div>
      </div>

      {/* Sort and Pagination Header */}
      <div className="flex justify-end items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <label className="text-[11px] uppercase tracking-wider">Sort</label>
          <select className="border border-gray-300 rounded-sm px-3 py-2 text-[13px] w-40 outline-none">
            <option>Lowest Rated</option>
          </select>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <ChevronLeft size={20} className="cursor-not-allowed opacity-30" />
          <span className="text-[12px] text-gray-600">1 / 1</span>
          <ChevronRight size={20} className="cursor-not-allowed opacity-30" />
        </div>
      </div>

      {/* Individual Review */}
      <div className="grid grid-cols-12 gap-8 border-t border-gray-100 pt-10 pb-16">
        {/* User Info Sidebar */}
        <div className="col-span-3 space-y-1">
          <p className="text-[13px] font-medium">EAnthroInsider1</p>
          <p className="text-[12px] text-gray-600 font-light">
            <span className="font-normal text-gray-800">Location:</span> Merion,
            PA
          </p>
          <p className="text-[12px] text-gray-600 font-light">
            <span className="font-normal text-gray-800">Age:</span> 35-39
          </p>
          <div className="pt-4">
            <span className="bg-gray-100 px-3 py-2 text-[11px] text-gray-600 uppercase tracking-tight">
              Anthro Insider
            </span>
          </div>
        </div>

        {/* Review Content */}
        <div className="col-span-9 relative">
          <div className="flex justify-between items-start mb-2">
            <div className="flex gap-0.5 text-[#eeb012]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" stroke="none" />
              ))}
            </div>
            <span className="text-[12px] text-gray-500 font-light">
              Dec 8, 2025
            </span>
          </div>
          <h4 className="text-[15px] font-medium mb-3">
            Perfect Personalization
          </h4>
          <p className="text-[13px] text-gray-600 font-light leading-relaxed">
            Looks like a family heirloom and completes any gallery wall. Makes a
            great gift!
          </p>
        </div>
      </div>

      {/* Footer Write Review Button */}
      <div className="border-t border-gray-100 pt-10 flex flex-col items-center">
        <button className="border border-[#262626] px-24 py-3 text-[12px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors">
          Write a Review
        </button>
        <div className="flex items-center gap-3 text-gray-400 mt-8">
          <ChevronLeft size={20} className="opacity-30" />
          <span className="text-[12px] text-gray-600">1 / 1</span>
          <ChevronRight size={20} className="opacity-30" />
        </div>
      </div>
    </section>
  );
};

export default function ShowEachProduct() {
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading } = useFetchAProduct(slug);
  console.log(product, "productproduct");

  // State for selections
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Memoized derived data
  const currentVariant = useMemo(() => {
    if (!product) return null;
    const color = product.colors.find(
      (c: any) => c.id === (selectedColorId || product.colors[0]?.id)
    );
    const size = color?.sizes?.find(
      (s: any) => s.id === (selectedSizeId || color?.sizes?.[0]?.id)
    );
    return { color, size };
  }, [product, selectedColorId, selectedSizeId]);

  // Handle image logic: If color has specific images, use them; otherwise use default product images
  const displayImages = useMemo(() => {
    if (!currentVariant?.color) return product?.images || [];
    return currentVariant.color.images?.length
      ? currentVariant.color.images.length > 0 && currentVariant.color.images
      : product?.images || [];
  }, [product, currentVariant]);

  // handle reviews
  const reviewsData = useMemo(() => {
    if (!product || !product.reviews?.length) {
      return {
        reviews: [],
        averageRating: 0,
        ratingCount: 0,
      };
    }

    const reviews = product.reviews;
    const ratingCount = reviews.length;

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / ratingCount;

    return {
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      ratingCount,
    };
  }, [product]);

  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse">Loading {slug}...</div>
    );
  if (!product)
    return <div className="p-20 text-center">Product Not Found</div>;

  // Price Calculation
  const basePrice = currentVariant?.size?.price || product.basePrice;

  const discountedPrice =
    product.discountType === "percentage"
      ? basePrice * (1 - product.discount / 100)
      : basePrice - product.discount;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingDots></LoadingDots>
      </div>
    );
  }

  if (!product)
    return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8 font-sans text-[#222222]">
      {/* Breadcrumbs */}
      <nav className="text-[10px] uppercase tracking-widest text-gray-400 mb-6 flex flex-wrap gap-2">
        <span className="hover:text-black cursor-pointer">
          {product.subCategories[0]?.subCategory?.category?.series?.name}
        </span>
        <span>/</span>
        <span className="hover:text-black cursor-pointer">
          {product.subCategories[0]?.subCategory?.category?.name}
        </span>
        <span>/</span>
        <span className="text-black font-semibold">
          {product.subCategories[0]?.subCategory?.name}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        {/* Left: Dynamic Image Gallery */}
        <div className="w-full lg:w-[60%] flex gap-4">
          <div className="hidden md:flex flex-col gap-2 w-20">
            {displayImages &&
              displayImages.map((img: any, idx: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`border ${
                    activeImgIndex === idx
                      ? "border-black"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img.image}
                    alt="thumbnail"
                    className="w-full aspect-[4/5] object-cover"
                  />
                </button>
              ))}
          </div>
          <div className="flex-1 relative aspect-[4/5] bg-gray-100 overflow-hidden">
            <img
              src={
                (displayImages &&
                  displayImages[activeImgIndex] &&
                  displayImages[activeImgIndex]?.image &&
                  displayImages[activeImgIndex]?.image) ||
                ""
              }
              alt={product.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase">
                -{product.discount}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Interaction */}
        <div className="w-full lg:w-[40%] flex flex-col">
          <h1 className="text-3xl font-light mb-2 capitalize">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="text-xs text-blue-600 underline cursor-pointer">
              0 Reviews
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-8">
            <p className="text-2xl font-medium">
              ${discountedPrice.toLocaleString()}
            </p>
            {product.discount > 0 && (
              <p className="text-gray-400 line-through text-lg">
                ${basePrice.toLocaleString()}
              </p>
            )}
          </div>

          {/* Color Selection with HexCodes */}
          {product.showColor && (
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest mb-3">
                Color: {currentVariant?.color?.color?.name}
              </p>
              <div className="flex gap-3">
                {product.colors.map((c: any) => (
                  <button
                    key={c.id}
                    className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${
                      (selectedColorId || product.colors[0].id) === c.id
                        ? "border-black scale-110"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      setSelectedColorId(c.id);
                      setActiveImgIndex(0); // Reset image to first of new color
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: c.color.hexCode }}
                      title={c.color.name}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-3">
              Size Selection*
            </p>
            <div className="flex flex-wrap gap-2">
              {currentVariant?.color?.sizes?.map((s: any) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSizeId(s.id)}
                  className={`px-4 py-2 text-xs border transition-colors ${
                    (selectedSizeId || currentVariant?.color?.sizes?.[0].id) ===
                    s.id
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  {s.size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Info */}
          <p className="text-[10px] uppercase font-bold text-gray-500 mb-4">
            Availability:{" "}
            {currentVariant?.size?.quantity
              ? currentVariant?.size?.quantity > 0 &&
                `${currentVariant.size.quantity} In Stock`
              : "Out of Stock"}
          </p>

          <button className="w-full bg-[#4E5B6D] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#3d4857] transition mb-4">
            Add to Basket
          </button>

          {/* Logistics from Object */}
          <div className="space-y-6 my-10 border-t pt-10">
            <div className="flex gap-4">
              <Truck size={20} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest">
                  Delivery Estimate
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {product.deliveryEstimate || "Check shipping at checkout"}
                </p>
              </div>
            </div>
          </div>

          {/* Accordions mapped to JSON keys */}
          <div className="border-t">
            {[
              { label: "Product Details", content: product.productDetails },
              {
                label: "Material/Dimension",
                content: `Dimensions: ${product.dimension}`,
              },
              { label: "Shipping & Returns", content: product.shippingReturn },
            ].map((item) => (
              <div key={item.label} className="border-b py-4 group">
                <div className="flex justify-between items-center cursor-pointer">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {item.label}
                  </span>
                  <Plus
                    size={16}
                    className="text-gray-400 group-hover:text-black"
                  />
                </div>
                <div className="hidden group-hover:block mt-4 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {item.content || "Information not available."}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="mb-20" />

      {/* Ratings & Reviews Section */}
      <ReviewsSection reviewsData={reviewsData}></ReviewsSection>

      {/* Trending Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-light tracking-tight">Trending Now</h2>
          <div className="flex gap-4">
            <button className="p-2 border rounded-full hover:bg-gray-100">
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 border rounded-full hover:bg-gray-100">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
                <div className="w-full h-full bg-gray-200" />{" "}
                {/* Replace with trending items images */}
              </div>
              <h3 className="text-[11px] font-medium leading-tight mb-1">
                Recommended Item {i}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Socials */}
      <div className="flex justify-center gap-6 mt-20 pt-10 border-t">
        <Facebook
          size={18}
          className="text-gray-400 hover:text-blue-600 cursor-pointer"
        />
        <Twitter
          size={18}
          className="text-gray-400 hover:text-blue-400 cursor-pointer"
        />
        <Instagram
          size={18}
          className="text-gray-400 hover:text-pink-600 cursor-pointer"
        />
      </div>
    </div>
  );
}
