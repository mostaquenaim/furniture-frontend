"use client";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { token } = useAuth();

  // Always add the interceptor, but conditionally add token
  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle 401 errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Clear local storage and redirect to login
          localStorage.clear();
          window.location.href = '/login?redirect=' + window.location.pathname;
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  return axiosSecure;
};

export default useAxiosSecure;