// hooks/useFetchProductReview.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Review } from "@/types/product.types";
import { AxiosError } from "axios";
import useAxiosPublic from "@/hooks/Axios/useAxiosPublic";

interface ProductReviewsResponse {
  reviews: Review[];
  ratingCount: number;
  averageRating: number;
}

interface UseFetchProductReviewReturn {
  reviews: Review[];
  ratingCount: number;
  averageRating: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

const useFetchProductReview = ({
  slug,
}: {
  slug: string;
}): UseFetchProductReviewReturn => {
  const axiosPublic = useAxiosPublic();

  const fetchProductReviews = async (): Promise<ProductReviewsResponse> => {
    const response = await axiosPublic.get<ProductReviewsResponse>(
      `/product/review/${slug}`,
    );

    console.log("reviews", response.data);
    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  }: UseQueryResult<ProductReviewsResponse, AxiosError> = useQuery({
    queryKey: ["product-reviews", slug],
    queryFn: fetchProductReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    reviews: data?.reviews ?? [],
    ratingCount: data?.ratingCount ?? 0,
    averageRating: data?.averageRating ?? 0,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch,
  };
};

export default useFetchProductReview;
