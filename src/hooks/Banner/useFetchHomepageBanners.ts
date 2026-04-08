// hooks/Banner/useFetchHomepageBanners.ts
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/Axios/useAxiosSecure";

const useFetchHomepageBanners = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["homepage-banners"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/homepage-banners");
      return data;
    },
  });

  return { banners: data ?? [], isLoading, refetch };
};

export default useFetchHomepageBanners;