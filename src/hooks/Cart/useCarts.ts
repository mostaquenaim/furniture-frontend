/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// hooks/useFetchCarts.ts

import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import useAxiosSecure from "../Axios/useAxiosSecure";
import { Cart, CartItem } from "@/types/product.types";
import { useAuth } from "@/context/AuthContext";

/**
 * API response structure
 */
interface CartResponse {
  id: number;
  subtotalAtAdd: number;
  baseSubtotalAtAdd: number;
  items: CartItem[];
}

/**
 * LocalStorage fallback
 */
const getLocalCart = (): CartResponse => {
  try {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const items = Array.isArray(localCart) ? localCart : [];
    const subtotalAtAdd = items.reduce(
      (sum, item) => sum + (item.subtotalAtAdd ?? 0),
      0,
    );
    const baseSubtotalAtAdd = items.reduce(
      (sum, item) => sum + (item.baseSubtotalAtAdd ?? 0),
      0,
    );

    return { items, subtotalAtAdd, baseSubtotalAtAdd };
  } catch {
    return { items: [], subtotalAtAdd: 0, baseSubtotalAtAdd: 0 };
  }
};

interface UseFetchCartsOptions {
  productSlug?: string;
  colorId?: number;
  sizeId?: number;
  isSummary?: boolean;
}

const useFetchCarts = (options?: UseFetchCartsOptions) => {
  const { loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const fetchCarts = async (): Promise<CartResponse> => {
    try {
      const params: Record<string, string | number | boolean> = {};
      if (options?.productSlug) params.productSlug = options.productSlug;
      if (options?.colorId) params.colorId = options.colorId;
      if (options?.sizeId) params.sizeId = options.sizeId;
      if (options?.isSummary) params.isSummary = options.isSummary;

      process.env.NODE_ENV === "development" && console.log(params, "params");

      const response = await axiosSecure.get<CartResponse>("/cart/items", {
        params,
      });

      process.env.NODE_ENV === "development" &&
        console.log("Fetched carts (server):", response.data);

      return response.data;
    } catch (error) {
      process.env.NODE_ENV === "development" &&
        console.warn("Server cart failed, using localStorage");

      return getLocalCart();
    }
  };

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<
    CartResponse,
    AxiosError
  >({
    queryKey: ["carts", options],
    queryFn: fetchCarts,
    enabled: !loading,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    placeholderData: keepPreviousData,
  });

  return {
    cart: data ?? {
      id: null,
      items: [],
      subtotalAtAdd: 0,
      baseSubtotalAtAdd: 0,
    },
    isLoading,
    isFetching,
    isError,
    error: error ?? null,
    refetch,
  };
};

export default useFetchCarts;
