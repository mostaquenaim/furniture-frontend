// hooks/useFetchProducts.ts
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product.types";
import useAxiosPublic from "./useAxiosPublic";

interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean | null;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const useFetchProducts = (params?: FetchProductsParams) => {
  const axiosPublic = useAxiosPublic();

  const fetchProducts = async (): Promise<ProductsResponse> => {
    const cleanParams: Record<string, any> = {};

    if (params?.page) cleanParams.page = params.page;
    if (params?.limit) cleanParams.limit = params.limit;
    if (params?.search) cleanParams.search = params.search;
    if (typeof params?.isActive === "boolean") {
      cleanParams.isActive = params.isActive;
    }

    const response = await axiosPublic.get<ProductsResponse>("/product/all", {
      params: cleanParams,
    });
    
    return response.data;
  };

  const queryKey = ["products", params?.page, params?.limit, params?.search, params?.isActive];

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ProductsResponse, Error>({
    queryKey,
    queryFn: fetchProducts,
    keepPreviousData: true, // Smooth pagination transitions
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    onError: (err: Error) => {
      console.error("Error fetching products:", err);
    },
  });

  return {
    products: response?.data || [],
    meta: response?.meta || {
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

export default useFetchProducts;