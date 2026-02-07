/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import useAxiosSecure from "../Axios/useAxiosSecure";
import { devLog } from "@/utils/devlog";

// ============================================================================
// Types
// ============================================================================

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export interface OrderItem {
  id: number;
  productId: number;
  productTitle: string;
  quantity: number;
  priceAtPurchase: number;
  totalPriceAtPurchase: number;
}

export interface ThumbOrder {
  id: number;
  orderId: number;
  createdAt: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
}

export interface FullOrder {
  id: number;
  orderId: string;
  trackingToken: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  districtId?: number | null;
  districtName?: string | null;
  deliveryMethod?: string | null;
  deliveryCharge?: number | null;
  couponCode?: string | null;
  discount?: number | null;
  total: number;
  itemCount?: number;
  status: OrderStatus;
  awbNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments: any[];
}

export interface PaginatedOrdersResponse<T = ThumbOrder | FullOrder> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  statusCounts: {
    CANCELLED: number;
    CONFIRMED: number;
    DELIVERED: number;
    PACKED: number;
    PENDING: number;
    RETURNED: number;
    SHIPPED: number;
  };
}

export interface GetAllOrdersOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  sortBy?: "createdAt" | "total" | "status";
  order?: "asc" | "desc";
  thumb?: boolean;
}
// ============================================================================
// Hook
// ============================================================================

interface UseOrdersReturn {
  orders: PaginatedOrdersResponse<ThumbOrder | FullOrder> | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: AxiosError | null;
  refetch: () => void;
}

const useOrders = (options?: GetAllOrdersOptions): UseOrdersReturn => {
  // console.log(options,'options');
  const { loading: authLoading, token } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isTokenReady, setIsTokenReady] = useState(false);

  // Wait until token is ready
  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => setIsTokenReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [authLoading, token]);

  const fetchOrders = async (): Promise<
    PaginatedOrdersResponse<ThumbOrder | FullOrder>
  > => {
    if (!token) throw new Error("Unauthorized");
    console.log(options, "options");

    const params: Record<string, any> = {};
    if (options?.page) params.page = options.page;
    if (options?.limit) params.limit = options.limit;
    if (options?.search) params.search = options.search;
    if (options?.status) params.status = options.status;
    if (options?.sortBy) params.sortBy = options.sortBy;
    if (options?.order) params.order = options.order;
    if (options?.thumb) params.thumb = options.thumb;

    try {
      const res = await axiosSecure.get<
        PaginatedOrdersResponse<ThumbOrder | FullOrder>
      >("/orders/all", { params });
      return res.data;
    } catch (error: any) {
      devLog("Failed to fetch orders", error);
      if (error.response?.status === 401)
        throw new Error("Unauthorized. Please login again.");
      throw error;
    }
  };

  const query = useQuery<PaginatedOrdersResponse, AxiosError>({
    queryKey: ["orders", options, token],
    queryFn: fetchOrders,
    enabled: !authLoading && isTokenReady,
    staleTime: 2 * 60 * 1000, // 2 min
    retry: (count, error) => {
      if (error.response?.status === 401) return false;
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      )
        return false;
      return count < 2;
    },
    refetchOnWindowFocus: false,
  });

  return {
    orders: query.data ?? null,
    isLoading: authLoading || query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error ?? null,
    refetch: query.refetch,
  };
};

export default useOrders;
