/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Star, ChevronRight, ChevronLeft, Truck, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useFetchAProduct from "@/hooks/Products/useFetchAProduct";
import LoadingDots from "../Loading/LoadingDS";
import { Review } from "@/types/product.types";
import Title from "../Headers/Title";
import ShowProductsFlex from "./ShowProductsFlex";
import LikeItShareIt from "./LikeItShareIt";
import { isAuthenticated } from "@/utils/auth";
import AuthModal from "../Auth/AuthModal";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";
import Link from "next/link";
import useCartCount from "@/hooks/Cart/useCartCount";

interface ReviewsSectionProps {
  data: {
    reviews: Review[];
    averageRating: number;
    ratingCount: number;
  };
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ data }) => {
  const { reviews, averageRating, ratingCount } = data;

  return (
    <section id="review" className="py-14 text-[#262626]">
      {/* Header */}
      <div className="mb-10">
        <Title title="Ratings & Reviews" />
      </div>

      {/* Summary Box */}
      <div className="flex flex-col items-center justify-center gap-2 py-10 px-6 bg-[#f9f8f6] mb-14 text-center">
        <p className="text-[13px] font-light">
          {averageRating || 0} stars <span className="mx-1">|</span>{" "}
          {ratingCount || 0} Reviews
        </p>
        <div className="flex gap-0.5 text-[#eeb012]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < Math.round(averageRating) ? "currentColor" : "none"}
              stroke="currentColor"
            />
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-[13px] font-medium mb-4">Filter Reviews</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] block mb-1">Star Rating</label>
              <select className="border border-gray-300 rounded-sm px-3 py-2 text-[13px] w-64 outline-none focus:border-gray-500">
                <option>5 Star</option>
              </select>
            </div>
            <button className="text-[11px] underline text-teal-700">
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Sort */}
        <div className="flex md:justify-end items-start">
          <div className="flex items-center gap-4 text-gray-400 mt-6">
            <label className="text-[11px] uppercase tracking-wider">Sort</label>
            <select className="border border-gray-300 rounded-sm px-3 py-2 text-[13px] w-40 outline-none">
              <option>Lowest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pagination Header */}
      <div className="flex justify-end items-center gap-3 mb-10 text-gray-400">
        <ChevronLeft size={20} className="cursor-not-allowed opacity-30" />
        <span className="text-[12px] text-gray-600">1 / 1</span>
        <ChevronRight size={20} className="cursor-not-allowed opacity-30" />
      </div>

      {/* Review Item */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-t border-gray-100 pt-12 pb-16">
        {/* User Info */}
        <div className="md:col-span-3 space-y-2">
          <p className="text-[13px] font-medium">EAnthroInsider1</p>
          <p className="text-[12px] text-gray-600 font-light">
            <span className="font-normal text-gray-800">Location:</span> Merion,
            PA
          </p>
          <p className="text-[12px] text-gray-600 font-light">
            <span className="font-normal text-gray-800">Age:</span> 35–39
          </p>
          <div className="pt-5">
            <span className="bg-gray-100 px-3 py-2 text-[11px] text-gray-600 uppercase tracking-tight">
              Anthro Insider
            </span>
          </div>
        </div>

        {/* Review Content */}
        <div className="md:col-span-9">
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-0.5 text-[#eeb012]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" stroke="none" />
              ))}
            </div>
            <span className="text-[12px] text-gray-500 font-light">
              Dec 8, 2025
            </span>
          </div>
          <h4 className="text-[15px] font-medium mb-2">
            Perfect Personalization
          </h4>
          <p className="text-[13px] text-gray-600 leading-relaxed max-w-2xl">
            Looks like a family heirloom and completes any gallery wall. Makes a
            great gift!
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-12 flex flex-col items-center">
        <button className="border border-[#262626] px-24 py-3 text-[12px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors">
          Write a Review
        </button>

        <div className="flex items-center gap-3 text-gray-400 mt-10">
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
  const { refetch } = useCartCount();
  const router = useRouter();

  const productTabs = [
    {
      id: 1,
      label: "Product Details",
      content: product?.productDetails ?? "",
    },
    {
      id: 2,
      label: "Material / Dimension",
      content: product?.dimension ? `Dimensions: ${product.dimension}` : "",
    },
    {
      id: 3,
      label: "Shipping & Returns",
      content: product?.shippingReturn ?? "",
    },
  ];

  // console.log(product, "productproduct");

  // State for selections
  const [selectedProductTab, setSelectedProductTab] = useState<string>("");
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    setQuantity(1);
  }, [selectedSizeId]);

  // Memoized derived data
  const currentVariant = useMemo(() => {
    if (!product) return null;
    const color = product.colors.find(
      (c: any) => c.id === (selectedColorId || product.colors[0]?.id),
    );
    const size = color?.sizes?.find(
      (s: any) => s.id === (selectedSizeId || color?.sizes?.[0]?.id),
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

  // Add to basket handler function
  const handleAddToBasket = async () => {
    if (!currentVariant?.size) {
      alert("Please select a size");
      return;
    }

    setIsAdding(true);

    try {
      const productSizeId =
        selectedSizeId || currentVariant?.color?.sizes?.[0].id;

      console.log(productSizeId, "productSizeId");

      const payload = {
        productSizeId,
        quantity: 1,
      };

      console.log(payload, "payload");

      const hasUser = isAuthenticated();

      let data = null;
      if (!hasUser) {
        // Get existing cart
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

        // Check if product already exists
        const existingItemIndex = existingCart.findIndex(
          (item: any) => item.productSizeId === productSizeId,
        );

        if (existingItemIndex !== -1) {
          // Increase quantity
          existingCart[existingItemIndex].quantity += 1;
        } else {
          // Add new item
          existingCart.push(payload);
        }

        // Save back to localStorage
        localStorage.setItem("cart", JSON.stringify(existingCart));
      } else {
        const response = await axiosSecure.post("/cart/items", payload);
        data = await response.data;
      }

      refetch(); // Update cart count in header

      setCartItemCount((prev) => prev + 1);
      setShowCartPreview(true);

      // Hide cart preview after 3 seconds
      setTimeout(() => {
        setShowCartPreview(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to basket");
    } finally {
      setIsAdding(false);
    }
  };

  const handleSelectProductTab = (label: string) => {
    console.log(label);
    setSelectedProductTab(label);
  };

  const handleCheckOut = () => {
    router.push("/cart");
  };

  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse">Loading {slug}...</div>
    );
  if (!product)
    return <div className="p-20 text-center">Product Not Found</div>;

  // Price Calculation
  const basePrice = currentVariant?.size?.price || product.basePrice;

  const discountedPrice =
    product.discountType === "PERCENT"
      ? basePrice * (1 - product.discount / 100)
      : basePrice - product.discount;

  const maxQuantity = Math.min(10, currentVariant?.size?.quantity || 0);

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
        <Link
          href={`/series/${product.subCategories[0]?.subCategory?.category?.series?.slug}`}
          className="hover:text-black cursor-pointer"
        >
          {product.subCategories[0]?.subCategory?.category?.series?.name}
        </Link>
        {/* <span>/</span>
        <span className="hover:text-black cursor-pointer">
          {product.subCategories[0]?.subCategory?.category?.name}
        </span> */}
        <span>/</span>
        <span className="text-black font-semibold">
          {product.subCategories[0]?.subCategory?.name}
        </span>
      </nav>

      {/* show cart preview */}
      {showCartPreview && (
        <div className="fixed top-0 lg:top-14 right-0 left-0 lg:left-auto lg:right-4 z-50 bg-white border border-gray-200 shadow-lg w-full lg:w-80 animate-fade-in">
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm font-medium mb-4 text-center">
              {quantity || 1} {quantity && quantity > 1 ? "items" : "item"}{" "}
              added to your basket
            </p>
            <div className="hidden md:flex items-start gap-3">
              <img
                src={
                  (displayImages &&
                    displayImages[activeImgIndex] &&
                    displayImages[activeImgIndex]?.image &&
                    displayImages[activeImgIndex]?.image) ||
                  ""
                }
                alt={product.title}
                className="w-20 h-24 object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">{product.title}</p>
                <p className="text-xs text-gray-600 mb-1">
                  ৳{discountedPrice.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  Color: {currentVariant?.color?.color?.name}
                </p>
                <p className="text-xs text-gray-500">
                  Size: {currentVariant?.size?.size?.name}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleCheckOut}
            className="w-full bg-[#4E5B6D] text-white py-3 text-xs uppercase tracking-wider hover:bg-[#3d4857] transition"
          >
            Checkout
          </button>
        </div>
      )}

      {/* display Images */}
      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        {/* Left: Dynamic Image Gallery */}
        <div className="w-full lg:w-[60%] flex gap-4">
          <div className="hidden md:flex flex-col gap-2 w-20">
            {displayImages &&
              displayImages?.map((img: any, idx: number) => (
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
          <div className="flex-1 relative aspect-4/5 bg-gray-100 overflow-hidden">
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
              {[...Array(5)]?.map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span
              // href="#review"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("review")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="text-xs text-blue-600 underline cursor-pointer"
            >
              0 Reviews
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-8">
            <p className="text-2xl font-medium">
              ৳{discountedPrice.toLocaleString()}
            </p>
            {product.discount > 0 && (
              <p className="text-gray-400 line-through text-lg">
                ৳{basePrice.toLocaleString()}
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
                {product.colors?.map((c: any) => (
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

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-3">
              Quantity*
            </p>

            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={!currentVariant?.size?.quantity}
              className="w-24 border border-gray-300 px-3 py-2 text-xs
               focus:outline-none focus:border-black
               disabled:bg-gray-100 disabled:text-gray-400"
            >
              {Array.from({ length: maxQuantity }, (_, i) => i + 1)?.map(
                (q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Stock Info */}
          <p className="text-[10px] uppercase font-bold text-gray-500 mb-4">
            Availability:{" "}
            {currentVariant?.size?.quantity
              ? currentVariant?.size?.quantity > 0 &&
                `${currentVariant.size.quantity} In Stock`
              : "Out of Stock"}
          </p>
          {/* action buttons */}
          <button
            onClick={handleAddToBasket}
            disabled={isAdding || !currentVariant?.size?.quantity}
            className="w-full bg-[#4E5B6D] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#3d4857] transition mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAdding
              ? "Adding..."
              : // : showCartPreview
                // ? "Added to Basket"
                "Add to Basket"}
          </button>
          {/* Logistics from Object */}
          <div className="space-y-6 my-10">
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
          <div className="border-t border-gray-200">
            {productTabs.map((item) => {
              const isOpen = selectedProductTab === item.label;

              return (
                <div key={item.label} className="border-b border-gray-200 py-4">
                  <div
                    onClick={() =>
                      setSelectedProductTab(isOpen ? "" : item.label)
                    }
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {item.label}
                    </span>
                    <Plus
                      size={16}
                      className={`transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </div>

                  {isOpen && (
                    <div className="mt-4 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                      {item.content || "Information not available."}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <section>
        <Title title={"You may also like"} />
        <ShowProductsFlex />
      </section>

      {/* Ratings & Reviews Section */}
      <section id="review">
        <ReviewsSection data={reviewsData} />
      </section>
      {/* Trending Section */}
      <section>
        <Title title="Trending Now" />
        <ShowProductsFlex />
      </section>

      <LikeItShareIt />
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
