"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import AdminDrawerPro from "./AdminDrawerPro";
import { AdminDrawerProvider } from "@/context/AdminContext";
import AdminHeader from "./AdminHeader";

const RoleBasedHeader = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith("/admin");
  const isAdmin = user?.role !== "CUSTOMER" && isAdminRoute;

  // For admin routes, return the complete admin layout components
  if (isAdmin) {
    return null;
    // (
    //   <AdminDrawerProvider>
    //     <AdminDrawerPro />
    //     <AdminHeader />
    //   </AdminDrawerProvider>
    // );
  }

  // For non-admin routes, return the regular header
  return <Header />;
};

export default RoleBasedHeader;
