/* eslint-disable @next/next/no-img-element */
"use client";
import { Product } from "@/types/product.types";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { useState } from "react";
import TakaIcon from "../TakaIcon";
import { useRouter } from "next/navigation";

export function QuickShopModal({
  product,
  onClose,
}: {
  product?: Product | null;
  onClose: () => void;
}) {
  console.log("modal product", product);
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const defaultColor = product?.colors[0];

  const [selectedColor, setSelectedColor] = useState(defaultColor);

  if (!product) return null;

  const sortedImages = [...product.images].sort(
    (a, b) => a.serialNo - b.serialNo,
  );

  const currentPrice = product.price;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : sortedImages.length - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < sortedImages.length - 1 ? prev + 1 : 0,
    );
  };

  const handleAddToBasket = async () => {
    router.push(`/products/${product.slug}`);
    onClose();
    // Implementation for adding to basket
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
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
            src={sortedImages[currentImageIndex]?.image}
            alt={product.title}
            className="w-full h-full object-cover aspect-square md:aspect-auto"
          />

          {/* Gallery Nav - Only show if multiple images */}
          {sortedImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                {sortedImages?.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full ${
                      idx === currentImageIndex ? "bg-black" : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-[45%] p-8 md:p-10 flex flex-col overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl md:text-2xl font-light leading-tight mb-2 pr-6">
            {product.title}
          </h2>

          <div className="mb-6">
            {product.price != product.basePrice ? (
              <div className="flex items-center gap-3">
                <p className="text-lg font-medium text-red-600">
                  <TakaIcon /> {currentPrice / 100}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  <TakaIcon /> {product.basePrice / 100}
                </p>
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded">
                  ৳{product.basePrice - product.price} OFF`
                </span>
              </div>
            ) : (
              <p className="text-lg font-medium">
                <TakaIcon /> {product.basePrice / 100}
              </p>
            )}
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* Color Selection */}
          {product.showColor && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs mb-3 text-gray-500 uppercase tracking-widest font-semibold">
                Color:{" "}
                <span className="text-black ml-1">
                  {product.colors.length} available
                </span>
              </p>
              <div className="flex gap-3">
                {product.colors?.map((color, i) => (
                  <button
                    key={color.id}
                    className={`w-10 h-10 rounded-full border-2 p-0.5 transition ${
                      selectedColor?.id === color.id
                        ? "border-black scale-110"
                        : "border-gray-200"
                    }`}
                    title={`Color option ${i + 1}`}
                    onClick={() => {
                      setSelectedColor(color);
                      setCurrentImageIndex(0); // reset gallery
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: color.color.hexCode }}
                      title={color.color.name}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Details */}
          {product.productDetails && (
            <div className="mb-6">
              <p className="text-xs text-gray-600 leading-relaxed">
                {product.productDetails}
              </p>
            </div>
          )}

          {/* Dimensions */}
          {product.dimension && (
            <div className="mb-6">
              <p className="text-xs mb-1 text-gray-500 uppercase tracking-widest font-semibold">
                Dimensions
              </p>
              <p className="text-xs text-gray-600">{product.dimension}</p>
            </div>
          )}

          {/* Delivery Estimate */}
          {product.deliveryEstimate && (
            <div className="mb-6">
              <p className="text-xs text-green-600">
                📦 {product.deliveryEstimate}
              </p>
            </div>
          )}

          {/* Qty & Add to Cart */}
          <div className="flex gap-2 mb-4">
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 px-4 py-3 text-xs appearance-none bg-white min-w-[60px]"
            >
              {[1, 2, 3, 4, 5]?.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {/* <button
              onClick={handleAddToBasket}
              disabled={isAdding || !currentVariant?.size?.quantity}
              className="w-full bg-[#4E5B6D] text-white py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#3d4857] transition mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAdding ? "Adding..." : "Add to Basket"}
            </button> */}
            <button
              onClick={handleAddToBasket}
              className="flex-1 bg-[#4E5B6D] text-white text-[11px] font-bold uppercase tracking-[0.2em] py-4 hover:bg-[#3d4857] transition"
            >
              Add to Basket
            </button>
          </div>

          {/* Payment Badges */}
          <p className="text-[10px] text-gray-500 text-center mb-8 italic">
            4 interest-free installments of ${(currentPrice / 400).toFixed(2)}{" "}
            with <span className="font-bold text-black">Klarna</span> or{" "}
            <span className="bg-black text-white px-1">Pay</span>
          </p>

          <button className="w-full py-4 border border-gray-300 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition">
            View Full Details
          </button>

          {/* Note */}
          {product.note && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-[10px] text-yellow-800">{product.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
