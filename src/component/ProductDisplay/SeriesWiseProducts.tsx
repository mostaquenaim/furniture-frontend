/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import priceData from "@/data/PriceData";
import sortData from "@/data/SortData";
import useFetchColors from "@/hooks/useFetchColors";
import useFetchMaterials from "@/hooks/useFetchMaterials";
import { Product, ProductImage } from "@/types/product.types";
import {
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useFetchSeriesWiseProducts from "@/hooks/Products/useFetchSeriesWiseProducts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DisplayHeading from "./Heading/DisplayHeading";
import BottomPagination from "../Pagination/BottomPagination";
import EachProductShow from "./EachProductShow";
import { QuickShopModal } from "./QuickShopModal";
import { devLog } from "@/utils/devlog";
import useFetchSeriesWiseSubcategories from "@/hooks/Categories/useFetchSeriesWiseSubcategories";

const PRODUCTS_PER_PAGE = 18;

type FilterDropdownProps = {
  type: string;
  data: any[];
  selectedIds?: number[];
  onToggleSelect?: (id: number) => void;
  onPriceSelect?: (min: number, max: number) => void;
  onClose: () => void;
};

const FilterDropdown = ({
  type,
  data,
  selectedIds = [],
  onToggleSelect,
  onPriceSelect,
  onClose,
}: any) => {
  return (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white border shadow-xl z-40">
      {/* PRICE */}
      {type === "Price" && (
        <div className="p-3 space-y-2">
          {data.map((price: any) => (
            <button
              key={price.id}
              onClick={() => onPriceSelect?.(price.min, price.max)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
            >
              {price.name}
            </button>
          ))}
        </div>
      )}

      {/* COLOR / MATERIAL */}
      {type !== "Price" && (
        <div className="p-3 space-y-2">
          {data.map((item: any) => {
            const active = selectedIds.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => onToggleSelect?.(item.id)}
                className={`flex justify-between w-full px-3 py-2 text-sm rounded
                  ${active ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                {item.name}
                {active && "✓"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function SeriesWiseProducts() {
  const { slug } = useParams<{ slug: string }>();
  const { subCategoryList: seriesWiseSubcategories } =
    useFetchSeriesWiseSubcategories(slug);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [filters, setFilters] = useState<{
    colorIds?: number[];
    materialIds?: number[];
    subCategoryIds?: number[];
    minPrice?: number;
    maxPrice?: number;
  }>({});

  const [activeDesktopFilter, setActiveDesktopFilter] = useState<string | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(
    sortData.sortCategories[0].name,
  );
  const [activeFilterTab, setActiveFilterTab] = useState<string | null>(null);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [productImage, setProductImage] = useState("");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [sortParams, setSortParams] = useState<{
    sortBy?: string;
    order?: "asc" | "desc";
  }>({});

  const {
    products,
    subcategories,
    blog,
    seriesName,
    meta,
    isLoading,
    isFetching,
    refetch,
  } = useFetchSeriesWiseProducts(slug, {
    page: currentPage,
    limit: PRODUCTS_PER_PAGE,

    colorIds: filters.colorIds,
    materialIds: filters.materialIds,
    subCategoryIds: filters.subCategoryIds,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: sortParams.sortBy,
    order: sortParams.order,
  });

  // console.log("useFetchSeriesWiseProducts", "products", products);

  const { colors: colorsData, isLoading: isColorLoading } = useFetchColors();
  const { materials, isLoading: isMaterialLoading } = useFetchMaterials();

  const totalPages = meta?.totalPages || 1;
  const totalProducts = meta?.total || 0;

  useEffect(() => {
    setCurrentPage(1);
    devLog(filters, "filters");
    // refetch();
  }, [
    filters.colorIds,
    filters.materialIds,
    filters.subCategoryIds,
    filters.minPrice,
    filters.maxPrice,
    // refetch,
  ]);

  useEffect(() => {
    if (isLoading) {
      document.title = `Sakigai - Series`;
    } else if (seriesName) {
      document.title = `Sakigai - ${seriesName}`;
    }
  }, [isLoading, seriesName]);

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

    if (product.discountType === "PERCENT") {
      return product.basePrice - (product.basePrice * product.discount) / 100;
    }
    return product.basePrice - product.discount;
  };

  const handleSortChange = (sortValue: string) => {
    setSelectedSort(sortValue);
    setCurrentPage(1);

    switch (sortValue) {
      // case "Relevance":
      //   setSortParams({ sortBy: "createdAt", order: "asc" });
      //   break;
      case "Price: Low to High":
        setSortParams({ sortBy: "price", order: "asc" });
        break;
      case "Price: High to Low":
        setSortParams({ sortBy: "price", order: "desc" });
        break;
      case "Newest":
        setSortParams({ sortBy: "createdAt", order: "desc" });
        break;
      case "Featured":
        setSortParams({ sortBy: "featured", order: "desc" });
        break;
      case "Bestselling":
        setSortParams({ sortBy: "sold", order: "desc" });
        break;
      case "Ratings":
        setSortParams({ sortBy: "rating", order: "desc" });
        break;
      case "A–Z":
        setSortParams({ sortBy: "title", order: "asc" });
        break;
      case "Z–A":
        setSortParams({ sortBy: "title", order: "desc" });
        break;
      default:
        setSortParams({});
    }
  };

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
      {/* <Head>
        <title>Sakigai - {seriesName}</title>
      </Head> */}
      {/* Breadcrumbs */}
      {/* <nav className="text-xs mb-8 flex items-center gap-2 text-gray-500">
          <span className="hover:underline cursor-pointer">Décor & Pillows</span>
          <span>/</span>
          <span className="text-black font-medium capitalize">
            {slug?.replace(/-/g, " ")}
          </span>
        </nav> */}
      {/* Header Section */}
      <DisplayHeading
        name={seriesName || slug?.replace(/-/g, " ")}
        isLoading={isLoading}
        totalProducts={totalProducts}
        isSortOpen={isSortOpen}
        setIsSortOpen={setIsSortOpen}
        selectedSort={selectedSort}
        handleSortChange={handleSortChange}
        setSelectedSort={setSelectedSort}
        sortData={sortData}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        currentPage={currentPage}
        totalPages={totalPages}
      />
      {/* Filter Bar */}
      <div className="mb-10">
        {/* Desktop Filters with Hover functionality */}
        <div className="hidden md:flex items-center gap-8 border-t border-gray-100 pt-4">
          {[
            { name: "Price", data: priceData.priceRanges },
            { name: "Color", data: colorsData },
            { name: "Material", data: materials },
          ].map((filter) => (
            <div key={filter.name} className="relative">
              <button
                onClick={() =>
                  setActiveDesktopFilter(
                    activeDesktopFilter === filter.name ? null : filter.name,
                  )
                }
                className="flex items-center gap-2 text-sm font-medium hover:opacity-60"
              >
                {filter.name}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    activeDesktopFilter === filter.name ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDesktopFilter === filter.name && (
                <FilterDropdown
                  type={filter.name as any}
                  data={filter.data}
                  selectedIds={
                    filter.name === "Color"
                      ? (filters.colorIds ?? [])
                      : filter.name === "Material"
                        ? (filters.materialIds ?? [])
                        : []
                  }
                  onToggleSelect={(id: number) => {
                    setCurrentPage(1);

                    setFilters((prev) => {
                      if (filter.name === "Color") {
                        const s = new Set(prev.colorIds ?? []);
                        s.has(id) ? s.delete(id) : s.add(id);
                        return { ...prev, colorIds: [...s] };
                      }

                      if (filter.name === "Material") {
                        const s = new Set(prev.materialIds ?? []);
                        s.has(id) ? s.delete(id) : s.add(id);
                        return { ...prev, materialIds: [...s] };
                      }

                      return prev;
                    });
                  }}
                  onPriceSelect={(min: number, max: number) => {
                    setCurrentPage(1);
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: min,
                      maxPrice: max,
                    }));
                    setActiveDesktopFilter(null);
                  }}
                  onClose={() => setActiveDesktopFilter(null)}
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

      {/* Applied Filters Bar */}
      {(filters.colorIds?.length ||
        filters.materialIds?.length ||
        filters.subCategoryIds?.length ||
        filters.minPrice ||
        filters.maxPrice) && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
          {/* Color chips */}
          {filters.colorIds?.map((id) => {
            const color = colorsData?.find((c: any) => c.id === id);
            if (!color) return null;

            return (
              <button
                key={`color-${id}`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    colorIds: prev.colorIds?.filter((c) => c !== id),
                  }))
                }
                className="flex items-center gap-2 px-3 py-1 border rounded-full bg-white hover:bg-gray-50"
              >
                <span
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: color.hexCode }}
                />
                {color.name}
                <X size={14} />
              </button>
            );
          })}

          {/* Material chips */}
          {filters.materialIds?.map((id) => {
            const material = materials?.find((m: any) => m.id === id);
            if (!material) return null;

            return (
              <button
                key={`material-${id}`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    materialIds: prev.materialIds?.filter((m) => m !== id),
                  }))
                }
                className="flex items-center gap-2 px-3 py-1 border rounded-full bg-white hover:bg-gray-50"
              >
                {material.name}
                <X size={14} />
              </button>
            );
          })}

          {/* Material chips */}
          {filters.subCategoryIds?.map((id) => {
            const subcat = subcategories?.find((m: any) => m.id === id);
            if (!subcat) return null;

            return (
              <button
                key={`subcat-${id}`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    subCategoryIds: prev.subCategoryIds?.filter(
                      (m) => m !== id,
                    ),
                  }))
                }
                className="flex items-center gap-2 px-3 py-1 border rounded-full bg-white hover:bg-gray-50"
              >
                {subcat.name}
                <X size={14} />
              </button>
            );
          })}

          {/* Price chip */}
          {(filters.minPrice || filters.maxPrice) && (
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: undefined,
                  maxPrice: undefined,
                }))
              }
              className="flex items-center gap-2 px-3 py-1 border rounded-full bg-white hover:bg-gray-50"
            >
              ৳{filters.minPrice ?? 0} – ৳{filters.maxPrice ?? "∞"}
              <X size={14} />
            </button>
          )}

          {/* Clear all */}
          <button
            onClick={() => {
              setFilters({});
              setCurrentPage(1);
            }}
            className="ml-2 text-xs underline text-gray-500 hover:text-black"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Product Cards from API */}
      {!isLoading && products && products.length > 0 ? (
        <EachProductShow
          products={products}
          setSelectedProduct={setSelectedProduct}
          getDisplayPrice={getDisplayPrice}
          productImage={productImage}
          hoveredProduct={hoveredProduct}
          setProductImage={setProductImage}
          setHoveredProduct={setHoveredProduct}
        />
      ) : !isLoading ? (
        <div className="col-span-2 md:col-span-3 text-center py-20 text-gray-500">
          No products found in this series
        </div>
      ) : null}
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
      {/* Pagination bottom */}
      {!isLoading && totalPages > 1 && (
        <BottomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
        />
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
                      {sortData.sortCategories?.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            // setSelectedSort(s.name);
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
                      // "Rooms",
                      // "In Stock",
                      "Color",
                      "Price",
                      "Material",
                    ]?.map((item) => (
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
                            checked={
                              filters.colorIds?.includes(color.id) ?? false
                            }
                            onChange={(e) => {
                              setFilters((prev) => {
                                const ids = new Set(prev.colorIds ?? []);
                                e.target.checked
                                  ? ids.add(color.id)
                                  : ids.delete(color.id);
                                return { ...prev, colorIds: Array.from(ids) };
                              });
                              // setCurrentPage(1);
                            }}
                            className="w-4 h-4 accent-black"
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
                            checked={
                              filters.materialIds?.includes(material.id) ??
                              false
                            }
                            onChange={(e) => {
                              setFilters((prev) => {
                                const ids = new Set(prev.materialIds ?? []);
                                e.target.checked
                                  ? ids.add(material.id)
                                  : ids.delete(material.id);
                                return {
                                  ...prev,
                                  materialIds: Array.from(ids),
                                };
                              });
                              // setCurrentPage(1);
                            }}
                            className="w-4 h-4 accent-black"
                          />

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
                      {/* price data select radio */}
                      {priceData.priceRanges?.map((price) => (
                        <label
                          key={price.id}
                          className="flex items-center gap-3 cursor-pointer py-1"
                        >
                          <input
                            type="radio"
                            name="price"
                            onChange={() => {
                              setFilters((prev) => ({
                                ...prev,
                                minPrice: price.min,
                                maxPrice: price.max,
                              }));
                              // setCurrentPage(1);
                            }}
                            className="w-4 h-4 accent-black"
                          />

                          <span className="text-sm text-gray-700">
                            {price.name}
                          </span>
                        </label>
                      ))}
                      {/* custom range  */}
                      <div className="pt-6">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-bold">
                          Custom Range
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                minPrice: Number(e.target.value),
                              }))
                            }
                          />

                          <input
                            type="number"
                            placeholder="Max"
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                maxPrice: Number(e.target.value),
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilterTab === "Product Type" && (
                    <div className="grid grid-cols-2 gap-4">
                      {seriesWiseSubcategories?.map((subCat: any) => (
                        <label
                          key={subCat.id}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={
                              filters.subCategoryIds?.includes(subCat.id) ??
                              false
                            }
                            onChange={(e) => {
                              setFilters((prev) => {
                                const ids = new Set(prev.subCategoryIds ?? []);
                                e.target.checked
                                  ? ids.add(subCat.id)
                                  : ids.delete(subCat.id);
                                return {
                                  ...prev,
                                  subCategoryIds: Array.from(ids),
                                };
                              });
                              // setCurrentPage(1);
                            }}
                            className="w-4 h-4 accent-black"
                          />

                          <span className="text-xs text-gray-700 group-hover:text-black">
                            {subCat.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Default for other tabs */}
                  {/* {activeFilterTab !== "Color" &&
                    activeFilterTab !== "Price" && (
                      <p className="text-sm text-gray-400 italic">
                        No options available for {activeFilterTab} yet.
                      </p>
                    )} */}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t flex gap-3 mt-auto">
              <button
                onClick={() => {
                  setFilters({});
                  // setCurrentPage(1);
                }}
                className="flex-1 py-4 border border-gray-200 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-black hover:border-black transition"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  setIsFilterOpen(false);
                  setActiveFilterTab(null);
                  // setCurrentPage(1);
                }}
                className="flex-1 py-4 bg-[#4E5B6D] text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#3d4857] transition"
              >
                View Results ({totalProducts})
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Blog Section - Only show if blog exists */}
      {blog && (
        <div className="my-10 p-6 bg-linear-to-r from-blue-50 to-gray-50 border border-blue-100 rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xl font-light mb-3">{blog.title}</h4>
              <div className="text-sm text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {blog?.content?.slice(0, 400)}
                </ReactMarkdown>
              </div>

              <Link
                href={`/blogs/${blog.slug}`}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Read full article
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            {/* <div className="text-xs text-gray-500 bg-white px-3 py-2 rounded border">
              From our blog
            </div> */}
          </div>
        </div>
      )}
      {/* Quick Shop Modal */}
      {selectedProduct && (
        <QuickShopModal
          slug={selectedProduct.slug}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
