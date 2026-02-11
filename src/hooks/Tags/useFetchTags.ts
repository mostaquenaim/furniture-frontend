import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useAxiosPublic from "../Axios/useAxiosPublic";

export interface Tag {
  id: number;
  name: string;
}

const useFetchTags = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: tags = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await axiosPublic.get("tags");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  if (isError) {
    console.error("Failed to load tags");
  }

  return { tags, isLoading, refetch };
};

export default useFetchTags;
