/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface ProductItem {
  productId: number;
  subCategoryId: number;
  product: Product;
}

interface ProductsResponse {
  data: ProductItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const useFetchSubcategoryWiseProducts = (
  subCategorySlug: string,
  params?: FetchProductsParams
) => {
  const axiosPublic = useAxiosPublic();

  const fetchProducts = async (): Promise<ProductsResponse> => {
    const cleanParams: Record<string, any> = {};

    if (params?.page) cleanParams.page = params.page;
    if (params?.limit) cleanParams.limit = params.limit;
    if (params?.search) cleanParams.search = params.search;
    
    if (typeof params?.isActive === "boolean") {
      cleanParams.isActive = params.isActive;
    }

    const response = await axiosPublic.get<ProductsResponse>(
      `/subcategory/${subCategorySlug}/products`,
      { params: cleanParams }
    );

    console.log(response.data,'subcategory data');

    return response.data;
  };

  const queryKey = [
    "subCatWiseProducts",
    subCategorySlug, // IMPORTANT: include this
    params?.page,
    params?.limit,
    params?.search,
    params?.isActive,
  ];

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<ProductsResponse>({
    queryKey,
    queryFn: fetchProducts,

    // ✅ v5 replacement for keepPreviousData
    placeholderData: (previousData) => previousData,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // cacheTime → gcTime in v5
    retry: 1,
  });

  return {
    products: response?.data ?? [],
    meta: response?.meta ?? {
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

export default useFetchSubcategoryWiseProducts;
