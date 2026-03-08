// hooks/useFetchProducts.ts
import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import useAxiosPublic from "@/hooks/Axios/useAxiosPublic";

export interface RelatedProductImage {
  id?: number;
  image: string;
  serialNo?: number;
}

export interface RelatedProduct {
  id: number;
  title: string;
  slug: string;
  price?: number;
  basePrice?: number;
  rating?: number;
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

const useFetchRelatedProducts = ({
  productSlug,
  productIds,
  categoryIds,
  categorySlug,
}: {
  productSlug?: string;
  productIds?: string;
  categorySlug?: string;
  categoryIds?: string;
}): UseFetchProductsReturn => {
  const axiosPublic = useAxiosPublic();

  const fetchRelatedProducts = async (): Promise<RelatedProduct[]> => {
    const response = await axiosPublic.get<RelatedProduct[]>(
      `/product/you-may-also-like?productSlug=${productSlug}&productIds=${productIds}&categoryIds=${categoryIds}&categorySlug=${categorySlug}`,
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
    queryKey: ["related-products", productSlug],
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
