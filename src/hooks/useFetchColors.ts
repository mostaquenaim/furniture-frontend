import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { toast } from "react-hot-toast";

export interface Color {
  id: number;
  name: string;
  hexCode: string;
}

const useFetchColors = () => {
  const axiosSecure = useAxiosSecure();
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await axiosSecure.get("/colors");
        setColors(res.data);
      } catch {
        toast.error("Failed to load colors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchColors();
  }, [axiosSecure]);

  return { colors, isLoading };
};

export default useFetchColors;
