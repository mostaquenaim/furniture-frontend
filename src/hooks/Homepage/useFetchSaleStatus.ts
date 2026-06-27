import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/Axios/useAxiosPublic";

const useFetchSaleStatus = () => {
  const axiosPublic = useAxiosPublic();

  const { data, isLoading } = useQuery<{ hasActiveSale: boolean; count: number }>({
    queryKey: ["sale-status"],
    queryFn: async () => {
      const res = await axiosPublic.get("/product/on-sale/status");
      return res.data;
    },
    staleTime: 3 * 60 * 1000,
  });

  return {
    hasActiveSale: data?.hasActiveSale ?? false,
    count: data?.count ?? 0,
    isLoading,
  };
};

export default useFetchSaleStatus;
