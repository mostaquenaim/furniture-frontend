/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { hasRequiredRole, getUserRole, isAuthenticated } from '@/utils/auth';
import LoadingDots from './Loading/LoadingDS';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  pathname?:string;
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  pathname,
  redirectTo = '/unauthorized'
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      // If no specific roles required, just check authentication
      if (allowedRoles.length === 0) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Check if user has required role
      if (!hasRequiredRole(allowedRoles)) {
        router.push(redirectTo);
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles, redirectTo, pathname]);

  isLoading && <LoadingDots></LoadingDots>

  return <>{isAuthorized && children}</>;
}