import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Axios/useAxiosPublic";
import { BlogPost } from "@/types/blog";

const useFetchBlogs = ({
  activeCategory,
}: {
  activeCategory?: string | null;
}) => {
  const axiosPublic = useAxiosPublic();

  const {
    data: blogPosts = [],
    isLoading,
    refetch,
    isError,
  } = useQuery<BlogPost[]>({
    queryKey: ["blogPosts", activeCategory],
    queryFn: async () => {
      const res = await axiosPublic.get(`/blogs`, {
        params: { activeCategory },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  return {
    blogPosts,
    isLoading,
    isError,
    refetch,
  };
};

export default useFetchBlogs;
