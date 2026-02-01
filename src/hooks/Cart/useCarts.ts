"use client";

import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import useAxiosSecure from "../Axios/useAxiosSecure";
import { CartItem } from "@/types/product.types";
import { devLog } from "@/utils/devlog";

// ============================================================================
// Types
// ============================================================================

interface CartCoupon {
  code: string;
}

interface CartResponse {
  id: number | null;
  subtotalAtAdd: number;
  baseSubtotalAtAdd: number;
  couponId?: number;
  coupon?: CartCoupon;
  items: CartItem[];
}

interface UseFetchCartsOptions {
  productSlug?: string;
  colorId?: number;
  sizeId?: number;
  isSummary?: boolean;
}

interface UseFetchCartsReturn {
  cart: CartResponse | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: AxiosError | null;
  refetch: () => void;
}

// ============================================================================
// Local Storage Utilities
// ============================================================================

const CART_STORAGE_KEY = "cart";

const getLocalCart = (): CartResponse => {
  if (typeof window === "undefined") {
    return createEmptyCart();
  }

  try {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!rawCart) {
      return createEmptyCart();
    }

    const parsedCart = JSON.parse(rawCart);
    const items = Array.isArray(parsedCart) ? parsedCart : [];

    return {
      id: null,
      items,
      subtotalAtAdd: calculateSubtotal(items, "subtotalAtAdd"),
      baseSubtotalAtAdd: calculateSubtotal(items, "baseSubtotalAtAdd"),
    };
  } catch (error) {
    devLog("Error parsing localStorage cart:", error);
    return createEmptyCart();
  }
};

const createEmptyCart = (): CartResponse => ({
  id: null,
  items: [],
  subtotalAtAdd: 0,
  baseSubtotalAtAdd: 0,
});

// ============================================================================
// Main Hook
// ============================================================================

const useFetchCarts = (options?: UseFetchCartsOptions): UseFetchCartsReturn => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Determine if we should use server cart or localStorage
  const shouldFetchFromServer = Boolean(user);

  const fetchCarts = async (): Promise<CartResponse> => {
    // If no user, return localStorage cart immediately
    if (!shouldFetchFromServer) {
      devLog("No user authenticated, using localStorage cart");
      return getLocalCart();
    }

    try {
      // Build query parameters
      const params: Record<string, string | number | boolean> = {};
      
      if (options?.productSlug) {
        params.productSlug = options.productSlug;
      }
      if (options?.colorId !== undefined) {
        params.colorId = options.colorId;
      }
      if (options?.sizeId !== undefined) {
        params.sizeId = options.sizeId;
      }
      if (options?.isSummary !== undefined) {
        params.isSummary = options.isSummary;
      }

      devLog("Fetching cart from server with params:", params);

      const response = await axiosSecure.get<CartResponse>("/cart/items", {
        params,
      });

      devLog("Server cart response:", response.data);

      return response.data;
    } catch (error) {
      devLog("Failed to fetch server cart, falling back to localStorage:", error);
      
      // Fallback to localStorage on server error
      return getLocalCart();
    }
  };

  const queryResult = useQuery<CartResponse, AxiosError>({
    queryKey: ["carts", options, shouldFetchFromServer],
    queryFn: fetchCarts,
    enabled: !authLoading, // Only wait for auth to complete
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        return false;
      }
      // Retry up to 2 times for server errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    placeholderData: keepPreviousData,
  });

  return {
    cart: queryResult.data ?? null,
    isLoading: authLoading || queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
    refetch: queryResult.refetch,
  };
};

export default useFetchCarts;