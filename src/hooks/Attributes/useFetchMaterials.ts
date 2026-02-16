import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAxiosPublic from "../Axios/useAxiosPublic";

export interface Material {
  id: number;
  name: string;
  slug: string;
  hexCode: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

const useFetchMaterials = () => {
  const axiosPublic = useAxiosPublic();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axiosPublic.get("/materials");
        setMaterials(res.data);
      } catch {
        toast.error("Failed to load materials");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, [axiosPublic]);

  return { materials, isLoading };
};

export default useFetchMaterials;
