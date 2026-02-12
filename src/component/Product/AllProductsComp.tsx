/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import sortData from "@/data/SortData";
import { Product, ProductImage } from "@/types/product.types";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useFetchSeriesWiseProducts from "@/hooks/Products/useFetchSeriesWiseProducts";
import DisplayHeading from "../ProductDisplay/Heading/DisplayHeading";
import FilterProducts from "../ProductDisplay/Filters/FilterProducts";
import EachProductShow from "../ProductDisplay/EachProductShow";
import BottomPagination from "../Pagination/BottomPagination";
import { QuickShopModal } from "../ProductDisplay/QuickShopModal";
import { devLog } from "@/utils/devlog";
import useFetchProducts from "@/hooks/Products/useFetchProducts";

const PRODUCTS_PER_PAGE = Number(process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE) || 18;

const AllProductsComp = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";

  console.log(searchQuery);

  const [filters, setFilters] = useState<{
    colorIds?: number[];
    materialIds?: number[];
    subCategoryIds?: number[];
    minPrice?: number;
    maxPrice?: number;
  }>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(
    sortData.sortCategories[0].name,
  );
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
  } = useFetchProducts( {
    page: currentPage,
    search: searchQuery,
    limit: PRODUCTS_PER_PAGE,

    colorIds: filters.colorIds,
    materialIds: filters.materialIds,
    subCategoryIds: filters.subCategoryIds,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: sortParams.sortBy,
    order: sortParams.order,
  });

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
    filters,
  ]);

  useEffect(() => {
    if (isLoading) {
      document.title = `All Products`;
    } else if (searchQuery) {
      document.title = `Search Results - ${searchQuery}`;
    }
  }, [isLoading, searchQuery]);

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
        setSortParams({ sortBy: "soldCount", order: "desc" });
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

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 font-sans text-[#222222]">
      {searchQuery && (
        <div className="flex justify-center items-center">
          <p>You searched for {" "}
            <span className="italic font-semibold">
                {searchQuery}
            </span>
          </p>
        </div>
      )}
      <DisplayHeading
        name={"All Products"}
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
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      {/* Filter Bar */}
      <FilterProducts
        setFilters={setFilters}
        setCurrentPage={setCurrentPage}
        filters={filters}
        handleSortChange={handleSortChange}
        selectedSort={selectedSort}
        // slug={slug}
        totalProducts={totalProducts}
      />

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
          No products found
        </div>
      ) : null}

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

      {/* filters sidebar */}

      {/* Blog Section - Only show if blog exists */}
      {/* {blog && <ShortBlog blog={blog} />} */}
      {/* Quick Shop Modal */}
      {selectedProduct && (
        <QuickShopModal
          slug={selectedProduct.slug}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default AllProductsComp;
