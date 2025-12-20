/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { hasRequiredRole, getUserRole, isAuthenticated } from "@/utils/auth";
import LoadingDots from "./Loading/LoadingDS";
import useAxiosSecure from "@/hooks/useAxiosSecure";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  route?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  route,
  redirectTo = "/unauthorized",
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  // console.log(pathname, "usePathname");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  const [allAllowedRoles, setAllAllowedRoles] = useState([...allowedRoles]);

  // permission check 
  useEffect(() => {
    const getPathName = async () => {
      try {
        const res = await axiosSecure.get(
          `/permission/roles-against-url?path=${encodeURIComponent(pathname)}`
        );
        setAllAllowedRoles([...res.data])
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
      // finally{
      //   setIsLoading(false)
      // }
    };

    if (pathname) getPathName();
  }, [pathname, axiosSecure]);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);

      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      // If no specific roles required, just check authentication
      if (allAllowedRoles.length === 0) {
        console.log("length 0", allAllowedRoles);
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Check if user has required role
      if (!hasRequiredRole(allAllowedRoles)) {
        // console.log("reject");
        router.push(redirectTo);
        return;
      }

      // console.log("yee");
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allAllowedRoles, redirectTo, pathname]);

  isLoading && <LoadingDots></LoadingDots>;

  return <>{isAuthorized && children}</>;
}
