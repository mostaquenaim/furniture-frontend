import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import localFont from "next/font/local";
import { Bodoni_Moda, Cinzel } from "next/font/google";
import { Toaster } from "react-hot-toast";
import RoleBasedHeader from "@/component/Headers/RoleBasedHeader";
import RoleBasedFooter from "@/component/Headers/RoleBasedFooter";

const avenir = localFont({
  src: "../../public/fonts/avenir/AvenirNext-Regular.woff",
});

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
    <html lang="en" className={`${bodoni.variable} ${cinzel.variable} regular`}>
      <Providers>
        <body>
          {/* <HeaderDS></HeaderDS> */}
          <RoleBasedHeader></RoleBasedHeader>
          {children}
          <RoleBasedFooter></RoleBasedFooter>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </body>
      </Providers>
    </html>
  );
}
