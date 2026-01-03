import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAxiosPublic from "./useAxiosPublic";

export interface Color {
  id: number;
  name: string;
  hexCode: string;
}

const useFetchColors = () => {
  const axiosPublic = useAxiosPublic();
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await axiosPublic.get("/colors");
        setColors(res.data);
      } catch {
        toast.error("Failed to load colors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchColors();
  }, [axiosPublic]);

  return { colors, isLoading };
};

export default useFetchColors;
