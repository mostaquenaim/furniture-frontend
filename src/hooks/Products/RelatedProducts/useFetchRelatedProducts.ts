// hooks/useFetchProducts.ts
import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { Product } from "@/types/product.types";
import { AxiosError } from "axios";
import useAxiosPublic from "@/hooks/Axios/useAxiosPublic";

export interface RelatedProductImage {
  id: number;
  image: string;
  serialNo: number;
}

export interface RelatedProduct {
  id: number;
  title: string;
  slug: string;
  images: RelatedProductImage[];
}

interface RelatedProductsResponse {
  data: RelatedProduct[];
}

interface UseFetchProductsReturn {
  relatedProducts: RelatedProduct[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
const useFetchRelatedProducts = (slug: string): UseFetchProductsReturn => {
  const axiosPublic = useAxiosPublic();

  const fetchRelatedProducts = async (): Promise<RelatedProduct[]> => {
    const response = await axiosPublic.get<RelatedProduct[]>(
      `/product/you-may-also-like/${slug}`,
    );

    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  }: UseQueryResult<RelatedProduct[], AxiosError> = useQuery({
    queryKey: ["related-products", slug],
    queryFn: fetchRelatedProducts,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return {
    relatedProducts: data ?? [],
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch,
  };
};

export default useFetchRelatedProducts;
