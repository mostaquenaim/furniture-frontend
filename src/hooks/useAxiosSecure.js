'use client'
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { token } = useAuth();

  axiosSecure.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return axiosSecure;
};

export default useAxiosSecure;
