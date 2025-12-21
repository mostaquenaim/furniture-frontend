import type { Metadata } from "next";
import "../globals.css";
import localFont from "next/font/local";
import { Bodoni_Moda, Cinzel, Inter, Manrope, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "../providers";
import ProtectedRoute from "@/component/ProtectedRoute";
import AdminGuard from "@/component/admin/auth/AdminGuard";
import { AdminDrawerProvider } from "@/context/AdminContext";

export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-bodoni",
  display: "swap",
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sakigai",
  description: "Premium Furniture Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} admin lg:ml-0 md:ml-20 flex justify-center items-center bg-gray-200`}>
      <Providers>
        <ProtectedRoute>
          {/* <AdminDrawerProvider> */}
            <body>
              {children}
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            </body>
          {/* </AdminDrawerProvider> */}
        </ProtectedRoute>
      </Providers>
    </html>
  );
}
