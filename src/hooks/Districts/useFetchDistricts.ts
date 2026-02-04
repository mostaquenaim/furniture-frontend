/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState, useEffect } from "react";
import axios from "axios";
import useAxiosPublic from "../Axios/useAxiosPublic";
import useAxiosSecure from "../Axios/useAxiosSecure";
import { useAuth } from "@/context/AuthContext";

type Districts = {
  name: string;
};

interface DistrictsResponse {
  id: number;
  name: string;
  deliveryFee: number;
}
[];

const useFetchDistricts = () => {
  const { loading } = useAuth();
  const [districts, setDistricts] = useState<DistrictsResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setIsLoading(true);

        const response =
          await axiosSecure.get<DistrictsResponse[]>("/districts");

        // console.log(response.data, "distrits");

        const data = response.data;

        // console.log(sortedData);
        setDistricts(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError("Something went wrong while fetching districts");
        }
      } finally {
        setIsLoading(false);
      }
    };

    !loading && fetchDistricts();
  }, [axiosSecure, loading]);

  return { districts, isLoading, error };
};

export default useFetchDistricts;
