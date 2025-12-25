import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { toast } from "react-hot-toast";

interface Series {
  id: number;
  name: string;
}

const useFetchSeries = () => {
  const axiosSecure = useAxiosSecure();
  const [seriesList, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await axiosSecure.get("/series");
        setSeries(res.data);
      } catch {
        toast.error("Failed to load series");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeries();
  }, [axiosSecure]);

  return { seriesList, isLoading };
};

export default useFetchSeries;
