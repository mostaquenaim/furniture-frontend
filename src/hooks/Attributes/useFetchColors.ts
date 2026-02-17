import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAxiosPublic from "../Axios/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Color } from "@/types/product.types";

const useFetchColors = ({ isEnabled = true }: { isEnabled?: boolean }) => {
  const axiosPublic = useAxiosPublic();

  const {
    data: colors = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Color[]>({
    queryKey: ["colors"],
    enabled: !!isEnabled, // wait until auth loading finishes
    queryFn: async () => {
      const response = await axiosPublic.get<Color[]>("/colors");
      return response.data;
    },
  });

  return {
    colors,
    isLoading,
    error: axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error?.message,
    refetch,
  };
};

export default useFetchColors;
