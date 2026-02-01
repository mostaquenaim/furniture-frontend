import { useState, useEffect } from "react";
import useAxiosPublic from "./Axios/useAxiosPublic";
import axios from "axios";
import { SeriesWithRelations } from "@/types/menu";

const useFetchNavItems = () => {
  const [navItems, setNavItems] = useState<SeriesWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        setIsLoading(true);

        const response = await axiosPublic.get<SeriesWithRelations[]>(
          "/series/with-relations",
        );

        // console.log(response.data, "series/with-relations");

        const data = response.data;

        // Sort Series → Categories → SubCategories (defensive, traditional)
        const sortedData = data
          .sort((a, b) => a.sortOrder - b.sortOrder)
          ?.map((series) => ({
            ...series,
            categories: series.categories
              ?.sort((a, b) => a.sortOrder - b.sortOrder)
              ?.map((category) => ({
                ...category,
                subCategories: category.subCategories?.sort(
                  (a, b) => a.sortOrder - b.sortOrder,
                ),
              })),
          }));

        // console.log(sortedData);
        setNavItems(sortedData);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError("Something went wrong while loading navigation");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNavData();
  }, [axiosPublic]);

  return { navItems, isLoading, error };
};

export default useFetchNavItems;
