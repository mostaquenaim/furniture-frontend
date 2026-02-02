import { useEffect, useState } from "react";
import useAxiosSecure from "../Axios/useAxiosSecure";
import { toast } from "react-hot-toast";

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

const useFetchSeriesWiseSubcategories = (seriesSlug: string) => {
  const axiosSecure = useAxiosSecure();
  const [subCategoryList, setSubCategoryList] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!seriesSlug) {
        setSubCategoryList([]);
        setIsLoading(false);
        return;
      }
      try {
        const res = await axiosSecure.get(
          `/series/${seriesSlug}/subcategories`,
        );
        setSubCategoryList(res.data);
      } catch {
        toast.error("Failed to load subcategories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubCategories();
  }, [axiosSecure, seriesSlug]);

  return { subCategoryList, isLoading };
};

export default useFetchSeriesWiseSubcategories;
