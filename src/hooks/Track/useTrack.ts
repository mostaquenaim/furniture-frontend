import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Axios/useAxiosPublic";
import useAxiosSecure from "../Axios/useAxiosSecure";
import { isAuthenticated } from "@/utils/auth";
// types/orderTracking.types.ts

export interface TrackingEvent {
  status: string;
  date: string;
  completed: boolean;
  current?: boolean;
}

export interface TrackedItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  sku?: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
}

export interface TrackedOrder {
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  status: string;
  awbNumber?: string;
  deliveryMethod?: string;
  deliveryCharge?: number;
  discount?: number;
  total: number;

  items: TrackedItem[];
  trackingEvents: TrackingEvent[];
  shippingAddress: ShippingAddress;
}

const useTrackOrder = (trackingId: string) => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const fetchOrder = async (): Promise<TrackedOrder> => {
    const axios = isAuthenticated() ? axiosSecure : axiosPublic;
    const { data } = await axios.get<TrackedOrder>(
      `/orders/track/${trackingId}`,
    );
    return data;
  };

  const query = useQuery<TrackedOrder, Error>({
    queryKey: ["track-order", trackingId],
    queryFn: fetchOrder,
    enabled: !!trackingId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  return {
    order: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useTrackOrder;
