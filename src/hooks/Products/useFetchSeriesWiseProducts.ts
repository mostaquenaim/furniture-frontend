/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useFetchSeriesWiseProducts.ts
import { useQuery } from "@tanstack/react-query";
import { FetchProductsParams, Product } from "@/types/product.types";
import useAxiosPublic from "../Axios/useAxiosPublic";
import { SubCategory } from "@/types/menu";
import { BlogPost } from "@/types/blog";

// Update or add this type
interface SeriesProductResponse {
  products: Product[];
  subcategories: SubCategory[];
  blog: BlogPost | null;
  series: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const useFetchSeriesWiseProducts = (
  seriesSlug: string,
  params?: FetchProductsParams
) => {
  const axiosPublic = useAxiosPublic();

  const fetchProducts = async (): Promise<SeriesProductResponse> => {
    const cleanParams: Record<string, any> = {};

    if (params?.page) cleanParams.page = params.page;
    if (params?.limit) cleanParams.limit = params.limit;
    if (params?.search) cleanParams.search = params.search;

    if (typeof params?.isActive === "boolean") {
      cleanParams.isActive = params.isActive;
    }

    const response = await axiosPublic.get<SeriesProductResponse>(
      `/series/${seriesSlug}/products`,
      { params: cleanParams }
    );

    console.log(response.data, "series data");

    return response.data; // Directly return response.data, not response.data.data
  };

  const queryKey = [
    "seriesWiseProducts",
    seriesSlug,
    params?.page,
    params?.limit,
    params?.search,
    params?.isActive,
  ];

  const { data, isLoading, isError, error, refetch, isFetching } =
    useQuery<SeriesProductResponse>({
      queryKey,
      queryFn: fetchProducts,
      placeholderData: (previousData) => previousData,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      enabled: !!seriesSlug, // Only fetch if seriesSlug exists
    });

  return {
    products: data?.products ?? [],
    subcategories: data?.subcategories ?? [],
    blog: data?.blog ?? null,
    seriesName: data?.series,
    meta: data?.meta ?? {
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: 1,
    },
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

export default useFetchSeriesWiseProducts;
