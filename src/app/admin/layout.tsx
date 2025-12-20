import type { Metadata } from "next";
import "../globals.css";
import localFont from "next/font/local";
import { Bodoni_Moda, Cinzel, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "../providers";
import ProtectedRoute from "@/component/ProtectedRoute";
import AdminGuard from "@/component/admin/auth/AdminGuard";

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
    <html lang="en" className={`${bodoni.variable} ${cinzel.variable} `}>
      <Providers>
        <ProtectedRoute>
            <body>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </body>
        </ProtectedRoute>
      </Providers>
    </html>
  );
}
