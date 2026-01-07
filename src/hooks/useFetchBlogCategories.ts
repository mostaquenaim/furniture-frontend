import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAxiosPublic from "./useAxiosPublic";

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const useFetchBlogCategories = () => {
  const axiosPublic = useAxiosPublic();
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await axiosPublic.get("/blogs/categories");
        setBlogCategories(res.data);
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchColors();
  }, [axiosPublic]);

  return { blogCategories, isLoading };
};

export default useFetchBlogCategories;
