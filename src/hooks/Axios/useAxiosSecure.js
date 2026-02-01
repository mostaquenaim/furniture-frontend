"use client";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const interceptor = axiosSecure.interceptors.request.use((config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      return () => {
        axiosSecure.interceptors.request.eject(interceptor);
      };
    }
  }, [loading]);

  return axiosSecure;
};

export default useAxiosSecure;
