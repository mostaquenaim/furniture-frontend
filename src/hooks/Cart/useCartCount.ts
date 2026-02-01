/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Axios/useAxiosSecure";
import { useAuth } from "@/context/AuthContext";

const getLocalCartCount = () => {
  try {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(localCart) ? localCart.length : 0;
  } catch {
    return 0;
  }
};

const useCartCount = () => {
  const { loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: cartCount = 0,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cartCount"],
    queryFn: async () => {
      try {
        // server count (already item-based ideally)
        const res = await axiosSecure.get("/cart/count");
        return res.data;
      } catch {
        // fallback to localStorage
        return getLocalCartCount();
      }
    },
    enabled: !loading,
    staleTime: 30 * 1000, // 30s cache — sane default
    refetchOnWindowFocus: false,
  });

  return { cartCount, isLoading, refetch };
};

export default useCartCount;
