import { useEffect, useState } from "react";
import useAxiosPublic from "../../Axios/useAxiosPublic";
import { Category } from "@/types/menu";
import toast from "react-hot-toast";

const useFetchSubcategories = ({
  isActive = true,
}: {
  isActive?: boolean | null;
}) => {
  const axiosPublic = useAxiosPublic();
  const [subcategoryList, setSubCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axiosPublic.get(
          `/subcategories?isActive=${isActive}`,
        );
        console.log(res.data, "sub-categories");
        setSubCategories(res.data);
      } catch {
        toast.error("Failed to load subcategories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategories();
  }, [axiosPublic, isActive]);

  return { subcategoryList, isLoading };
};

export default useFetchSubcategories;
