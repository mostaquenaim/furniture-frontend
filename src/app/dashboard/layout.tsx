import type { Metadata } from "next";
import "../globals.css";
import ProtectedRoute from "@/component/ProtectedRoute";
import CustomerDashboard from "@/component/Headers/CustomerDrawer";

export const metadata: Metadata = {
  title: "Customer Dashboard - Sakigai",
  description: "Customer Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <body className="">
        {/* <CustomerDashboard /> */}
        {children}
      </body>
    </ProtectedRoute>
  );
}
