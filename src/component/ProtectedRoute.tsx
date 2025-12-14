"use client";

import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  requiredPermissions = [],
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (
      requiredPermissions.length &&
      !user?.permissions.includes("*") &&
      !requiredPermissions.every((p) => user?.permissions.includes(p))
    ) {
      router.replace("/403");
    }
  }, [isAuthenticated, requiredPermissions, router, user?.permissions]);

  return children;
}
