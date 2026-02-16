import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import ProtectedRoute from "@/component/ProtectedRoute";
import AdminGuard from "@/component/admin/auth/AdminGuard";
import { AdminDrawerProvider, useAdminDrawer } from "@/context/AdminContext";
import AdminDrawer from "@/component/Headers/AdminDrawerTS";
import AdminHeader from "@/component/Headers/AdminHeader";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sakigai Admin Pro",
  description: "Premium Furniture Marketplace Administration",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <div className={`${inter.variable} font-sans antialiased`}>
      <Providers>
        <ProtectedRoute>
          <AdminGuard>
            <AdminDrawerProvider>
              <div className="min-h-screen bg-gray-50">
                <AdminDrawer />
                <div className="transition-all duration-300">
                  <AdminHeader />
                  {/* ${isAdminOpen ? 'md:pl-64' : 'md:pl-20'} */}
                  <main className={`p-4 sm:p-6 lg:p-8 bg-slate-100 
                    `}>
                    <div className="max-w-7xl mx-auto">
                      {children}
                    </div>
                  </main>
                </div>
              </div>
            </AdminDrawerProvider>
          </AdminGuard>
        </ProtectedRoute>
      </Providers>
    </div>
  );
}