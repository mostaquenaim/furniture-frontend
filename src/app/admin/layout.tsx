import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "../providers";
import ProtectedRoute from "@/component/ProtectedRoute";
import AdminGuard from "@/component/admin/auth/AdminGuard";
import { AdminDrawerProvider } from "@/context/AdminContext";
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
                  <main className="p-4 sm:p-6 lg:p-8 bg-slate-100">
                    <div className="max-w-7xl mx-auto">
                      {children}
                    </div>
                  </main>
                </div>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    className: "text-sm",
                    success: {
                      iconTheme: {
                        primary: "#10b981",
                        secondary: "#ffffff",
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: "#ef4444",
                        secondary: "#ffffff",
                      },
                    },
                  }}
                />
              </div>
            </AdminDrawerProvider>
          </AdminGuard>
        </ProtectedRoute>
      </Providers>
    </div>
  );
}