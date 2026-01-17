import { useEffect, useState } from "react";
import useAxiosSecure from "./Axios/useAxiosSecure";
import { toast } from "react-hot-toast";

export interface Variant {
  id: number;
  name: string;
  sizes?: {
    name: string;
    id: number;
  }[];
}

const useFetchVariants = () => {
  const axiosSecure = useAxiosSecure();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await axiosSecure.get("/variant");
        console.log("variant", res.data);
        setVariants(res.data);
      } catch {
        toast.error("Failed to load variants");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVariants();
  }, [axiosSecure]);

  return { variants, isLoading };
};

export default useFetchVariants;
