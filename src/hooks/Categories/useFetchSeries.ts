import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAxiosPublic from "../Axios/useAxiosPublic";
import { Series } from "@/types/menu";

const useFetchSeries = () => {
  const axiosPublic = useAxiosPublic();
  const [seriesList, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await axiosPublic.get("/series");
        console.log(res.data, "serieees");
        setSeries(res.data);
      } catch {
        toast.error("Failed to load series");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeries();
  }, [axiosPublic]);

  return { seriesList, isLoading };
};

export default useFetchSeries;
