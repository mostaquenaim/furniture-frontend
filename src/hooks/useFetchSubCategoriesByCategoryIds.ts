import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { toast } from "react-hot-toast";

interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

const useFetchSubCategoriesByCategoryIds = (categoryIds: number[] | []) => {
  console.log("object");
  const axiosSecure = useAxiosSecure();
  const [subCategoryList, setSubCategoryList] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!categoryIds) {
        setSubCategoryList([]);
        setIsLoading(false);
        return;
      }
      try {
        const res = await axiosSecure.get(`subcategories/with-relations`);
        console.log(res.data);
        setSubCategoryList(res.data);
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubCategories();
  }, [axiosSecure, categoryIds]);

  return { subCategoryList, isLoading };
};

export default useFetchSubCategoriesByCategoryIds;
