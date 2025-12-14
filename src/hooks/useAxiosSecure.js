import axios from "axios";
import { useAuth } from "@/store/auth";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const accessToken = useAuth((s) => s.accessToken);

  axiosSecure.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  return axiosSecure;
};

export default useAxiosSecure;
