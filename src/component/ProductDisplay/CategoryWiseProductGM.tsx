/* eslint-disable @next/next/no-img-element */
"use client";
import priceData from "@/data/PriceData";
import sortData from "@/data/SortData";
import useFetchColors from "@/hooks/useFetchColors";
import useFetchMaterials from "@/hooks/useFetchMaterials";
import useFetchSubcategoryWiseProducts from "@/hooks/useFetchSubcategoryWiseProducts";
import {
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

// Types matching your API response
interface ProductImage {
  id: number;
  image: string;
  serialNo: number;
  productId: number;
}

interface Color {
  id: number;
  name: string;
  hexCode: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

interface ProductColor {
  id: number;
  useDefaultImages: boolean;
  colorId: number;
  productId: number;
  color: Color;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  sku: string | null;
  description: string | null;
  basePrice: number;
  hasColorVariants: boolean;
  showColor: boolean;
  discountType: string | null;
  discount: number | null;
  discountEnd: string | null;
  discountStart: string | null;
  note: string | null;
  deliveryEstimate: string | null;
  productDetails: string | null;
  dimension: string | null;
  shippingReturn: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  colors: ProductColor[];
}

interface ProductItem {
  productId: number;
  subCategoryId: number;
  product: Product;
}

function QuickShopModal({
  product,
  onClose,
}: {
  product?: Product | null;
  onClose: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const sortedImages = [...product.images].sort(
    (a, b) => a.serialNo - b.serialNo
  );
  const currentPrice = product.discount
    ? product.discountType === "percentage"
      ? product.basePrice - (product.basePrice * product.discount) / 100
      : product.basePrice - product.discount
    : product.basePrice;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : sortedImages.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < sortedImages.length - 1 ? prev + 1 : 0
    );
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
                {sortedImages.map((_, idx) => (
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
            {product.discount ? (
              <div className="flex items-center gap-3">
                <p className="text-lg font-medium text-red-600">
                  ${(currentPrice / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  ${(product.basePrice / 100).toFixed(2)}
                </p>
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded">
                  {product.discountType === "percentage"
                    ? `${product.discount}% OFF`
                    : `$${(product.discount / 100).toFixed(2)} OFF`}
                </span>
              </div>
            ) : (
              <p className="text-lg font-medium">
                ${(product.basePrice / 100).toFixed(2)}
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
                {product.colors.map((color, i) => (
                  <button
                    key={color.id}
                    className={`w-10 h-10 rounded-full border-2 p-0.5 transition ${
                      i === 0 ? "border-black" : "border-gray-300"
                    } hover:border-black`}
                    title={`Color option ${i + 1}`}
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-400" />
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
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <button className="flex-1 bg-[#4E5B6D] text-white text-[11px] font-bold uppercase tracking-[0.2em] py-4 hover:bg-[#3d4857] transition">
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

const PRODUCTS_PER_PAGE = 18;

function FilterDropdown({
  type,
  data,
  onClose,
}: {
  type: string;
  data: any[];
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-full left-0 mt-2 w-64 bg-white shadow-xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      onMouseLeave={onClose}
    >
      <div className="max-h-80 overflow-y-auto p-4 custom-scrollbar">
        {data?.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              {/* Conditional rendering for Color circles */}
              {type === "Color" && (
                <div
                  className="w-4 h-4 rounded-full border border-black"
                  style={{ backgroundColor: item.hexCode }}
                />
              )}
              <span className="text-sm text-gray-700 group-hover:text-black">
                {item.name}
              </span>
            </div>
            {/* Mock count as seen in your screenshot */}
            <span className="text-xs text-gray-400">(24)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CategoryWiseProduct() {
  const { slug } = useParams<{ slug: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(sortData.sortCategories[0].name);
  const [activeFilterTab, setActiveFilterTab] = useState<string | null>(null);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (filter: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredFilter(filter);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredFilter(null);
    }, 150);
  };

  const { products, meta, isLoading, isFetching } =
    useFetchSubcategoryWiseProducts(slug, {
      page: currentPage,
      limit: PRODUCTS_PER_PAGE,
    });

  const { colors: colorsData, isLoading: isColorLoading } = useFetchColors();
  const { materials, isLoading: isMaterialLoading } = useFetchMaterials();

  // console.log(products, "sortedImages");

  const totalPages = meta?.totalPages || 1;
  const totalProducts = meta?.total || 0;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getDisplayPrice = (product: Product) => {
    if (!product.discount) return product.basePrice;

    if (product.discountType === "percentage") {
      return product.basePrice - (product.basePrice * product.discount) / 100;
    }
    return product.basePrice - product.discount;
  };

  const handleSortChange = (sortValue: string) => {
    // Example: refetch products
    // fetchProducts({
    //   page: currentPage,
    //   sort: sortValue,
    // });
  };

  const [productImage, setProductImage] = useState("");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const handleImageChange = (images: ProductImage[]) => {
    // console.log(images, "imageeeeeees");
    const sortedImages = images.sort((a, b) => a.serialNo - b.serialNo);

    let secondImage = sortedImages[0].image;
    if (images.length > 1) secondImage = sortedImages[1].image;

    setProductImage(secondImage);
    setHoveredProduct(sortedImages[0].productId);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 font-sans text-[#222222]">
      {/* Breadcrumbs */}
      <nav className="text-xs mb-8 flex items-center gap-2 text-gray-500">
        <span className="hover:underline cursor-pointer">Décor & Pillows</span>
        <span>/</span>
        <span className="text-black font-medium capitalize">
          {slug?.replace(/-/g, " ")}
        </span>
      </nav>

      {/* Header Section */}
      <div className="flex justify-between items-baseline mb-6">
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">
          <span className="heading capitalize">
            {slug?.replace(/-/g, " ")}{" "}
          </span>
          <span className="text-xs bottom-0 ml-2 text-gray-400">
            {isLoading ? "..." : `${totalProducts} products`}
          </span>
        </h1>

        {/* Desktop Sort - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-4 relative">
          <span className="text-xs uppercase tracking-widest text-gray-500">
            Sort:
          </span>

          {/* Sort Trigger */}
          <div
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="border-b border-black flex items-center gap-8 pb-1 cursor-pointer select-none"
          >
            <span className="text-sm">{selectedSort}</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          {isSortOpen && (
            <div className="absolute top-full left-[48px] mt-2 w-56 bg-white border shadow-lg z-40">
              {sortData.sortCategories.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSort(item.name);
                    setIsSortOpen(false);
                    handleSortChange(item.name); 
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 ${
                    selectedSort === item.name ? "font-medium bg-gray-50" : ""
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center gap-4 ml-6">
            <ChevronLeft
              size={18}
              className={`${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={handlePrevPage}
            />
            <span className="text-xs font-medium">
              {currentPage} / {totalPages}
            </span>
            <ChevronRight
              size={18}
              className={`${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={handleNextPage}
            />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-10">
        {/* Desktop Filters with Hover functionality */}
        <div className="hidden md:flex items-center gap-8 border-t border-gray-100 pt-4">
          {[
            { name: "Price", data: priceData.priceRanges },
            // { name: "Rooms", data: [] },
            // { name: "In Stock", data: [] },
            { name: "Color", data: colorsData },
            { name: "Material", data: materials },
          ].map((filter) => (
            <div
              key={filter.name}
              className="relative"
              onMouseEnter={() => handleMouseEnter(filter.name)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  hoveredFilter === filter.name
                    ? "text-gray-400"
                    : "hover:opacity-60"
                }`}
              >
                {filter.name}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    hoveredFilter === filter.name ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Show dropdown on hover */}
              {hoveredFilter === filter.name && filter.data.length > 0 && (
                <FilterDropdown
                  type={filter.name}
                  data={filter.data || []}
                  onClose={() => setHoveredFilter(null)}
                />
              )}
            </div>
          ))}

          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 text-sm font-medium border-l pl-8"
          >
            All Filters <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="w-full py-4 border border-gray-200 flex items-center justify-center gap-3 text-sm tracking-wide"
          >
            <SlidersHorizontal size={16} />
            Filter & Sort
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Product Grid */}
      {!isLoading && (
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

          {/* Product Cards from API */}
          {products && products.length > 0 ? (
            products.map((item: ProductItem) => {
              const product = item.product;
              const mainImage = product.images.sort(
                (a, b) => a.serialNo - b.serialNo
              )[0];
              const displayPrice = getDisplayPrice(product);

              return (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onMouseLeave={() => setProductImage("")}
                  onMouseEnter={() => handleImageChange(product.images)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
                    <img
                      src={
                        hoveredProduct === product.id
                          ? productImage || mainImage?.image
                          : mainImage?.image
                      }
                      alt={product.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Discount Badge */}
                    {product.discount && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        {product.discountType === "percentage"
                          ? `${product.discount}% OFF`
                          : `$${(product.discount / 100).toFixed(0)} OFF`}
                      </div>
                    )}

                    {/* Quick Shop Button - Slides up on hover */}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute bottom-0 left-0 w-full bg-white/90 py-3 text-[10px] font-bold uppercase tracking-[0.2em] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hover:bg-black hover:text-white"
                    >
                      Quick Shop
                    </button>
                  </div>
                  <h3 className="text-xs font-medium leading-relaxed mb-1">
                    {product.title}
                  </h3>
                  <div className="mb-3">
                    {product.discount ? (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-red-600 font-medium">
                          ${(displayPrice / 100).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-gray-400 line-through">
                          ${(product.basePrice / 100).toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600">
                        ${(product.basePrice / 100).toFixed(2)}
                      </p>
                    )}
                  </div>
                  {product.showColor && product.colors.length > 0 && (
                    <div className="flex gap-1 items-center">
                      {product.colors.slice(0, 5).map((color) => (
                        <div
                          key={color.id}
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: color.color.hexCode }}
                        />
                      ))}
                      <span className="text-[10px] text-gray-400 ml-1">
                        {product.colors.length} color
                        {product.colors.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-2 md:col-span-3 text-center py-20 text-gray-500">
              No products found
            </div>
          )}
        </div>
      )}

      {/* Pagination - Mobile */}
      {!isLoading && totalPages > 1 && (
        <div className="md:hidden flex justify-center items-center gap-4 mt-12">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-black"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-black"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Loading overlay during fetching */}
      {isFetching && !isLoading && (
        <div className="fixed inset-0 bg-white/50 z-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}

      {isFilterOpen && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={() => {
              setIsFilterOpen(false);
              setActiveFilterTab(null);
            }}
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute right-0 top-0 w-full sm:w-[420px] animate-filter-slide bg-[#FAF9F7] h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b text-center relative">
              {activeFilterTab && (
                <button
                  onClick={() => setActiveFilterTab(null)}
                  className="absolute left-4 top-5 text-gray-500 flex items-center gap-1 text-[10px] uppercase tracking-widest"
                >
                  <ChevronLeft size={14} /> Back
                </button>
              )}
              <p className="text-xs tracking-widest uppercase text-gray-500">
                {activeFilterTab ? activeFilterTab : "Filter & Sort"}
              </p>
              <button
                onClick={() => {
                  setIsFilterOpen(false);
                  setActiveFilterTab(null);
                }}
                className="absolute right-4 top-5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!activeFilterTab ? (
                <>
                  {/* Sort Section (Pills) */}
                  <div className="px-6 py-6 border-b">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4 font-bold">
                      Sort By
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sortData.sortCategories.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSelectedSort(s.name);
                            // setIsSortOpen(false);
                            handleSortChange(s.name);
                          }}
                          className={`px-4 py-2 border text-[11px] transition-colors ${
                            selectedSort === s.name
                              ? "bg-black text-white border-black"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Category List */}
                  <div className="divide-y divide-gray-100">
                    {[
                      "Product Type",
                      "Rooms",
                      "In Stock",
                      "Color",
                      "Price",
                      "Material",
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => setActiveFilterTab(item)}
                        className="w-full px-6 py-5 flex items-center justify-between text-sm font-medium hover:bg-white transition-colors"
                      >
                        {item}
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* COLOR VIEW */}
                  {activeFilterTab === "Color" && (
                    <div className="grid grid-cols-2 gap-4">
                      {colorsData?.map((color: any) => (
                        <label
                          key={color.id}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded accent-black"
                          />
                          <div
                            className="w-5 h-5 rounded-full border border-gray-200"
                            style={{ backgroundColor: color.hexCode }}
                          />
                          <span className="text-xs text-gray-700 group-hover:text-black">
                            {color.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* MATERIAL VIEW */}
                  {activeFilterTab === "Material" && (
                    <div className="grid grid-cols-2 gap-4">
                      {materials?.map((material: any) => (
                        <label
                          key={material.id}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded accent-black"
                          />
                          {/* <div
                            className="w-5 h-5 rounded-full border border-gray-200"
                            style={{ backgroundColor: material.hexCode }}
                          /> */}
                          <span className="text-xs text-gray-700 group-hover:text-black">
                            {material.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* PRICE VIEW */}
                  {activeFilterTab === "Price" && (
                    <div className="space-y-4">
                      {priceData.priceRanges.map((price) => (
                        <label
                          key={price.id}
                          className="flex items-center gap-3 cursor-pointer py-1"
                        >
                          <input
                            type="radio"
                            name="price"
                            className="w-4 h-4 accent-black"
                          />
                          <span className="text-sm text-gray-700">{price.name}</span>
                        </label>
                      ))}
                      <div className="pt-6">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-bold">
                          Custom Range
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            className="w-full border p-2 text-xs"
                          />
                          <span className="text-gray-400">-</span>
                          <input
                            type="number"
                            placeholder="Max"
                            className="w-full border p-2 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Default for other tabs */}
                  {activeFilterTab !== "Color" &&
                    activeFilterTab !== "Price" && (
                      <p className="text-sm text-gray-400 italic">
                        No options available for {activeFilterTab} yet.
                      </p>
                    )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t flex gap-3 mt-auto">
              <button className="flex-1 py-4 border border-gray-200 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-black hover:border-black transition">
                Clear All
              </button>
              <button className="flex-1 py-4 bg-[#4E5B6D] text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#3d4857] transition">
                View Results ({totalProducts})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Shop Modal */}
      {selectedProduct && (
        <QuickShopModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
