import { useEffect, useState } from "react";
import useAxiosPublic from "../../Axios/useAxiosPublic";
import { Category } from "@/types/menu";
import toast from "react-hot-toast";

const useFetchCategories = ({ isActive = true }: { isActive?: boolean | null }) => {
  const axiosPublic = useAxiosPublic();
  const [categoryList, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

//   console.log(isActive, " check if active");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosPublic.get(`/categories?isActive=${isActive}`);
        console.log(res.data, "categories");
        setCategories(res.data);
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [axiosPublic, isActive]);

  return { categoryList, isLoading };
};

export default useFetchCategories;
