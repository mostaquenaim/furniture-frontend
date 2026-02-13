import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAxiosPublic from "../../Axios/useAxiosPublic";
import { Series } from "@/types/menu";
import { series } from "@/data/Categories";

const useFetchSeries = ({ isActive = true }: { isActive?: boolean | null }) => {
  const axiosPublic = useAxiosPublic();
  const [seriesList, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(isActive, " check if active");

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await axiosPublic.get(`/series?isActive=${isActive}`);
        console.log(res.data, "serieees");
        setSeries(res.data);
      } catch {
        setSeries(series);
        // toast.error("Failed to load series");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeries();
  }, [axiosPublic, isActive]);

  return { seriesList, isLoading };
};

export default useFetchSeries;
