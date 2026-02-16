import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import localFont from "next/font/local";
import { Bodoni_Moda, Cinzel } from "next/font/google";
import { Toaster } from "react-hot-toast";
import RoleBasedHeader from "@/component/Headers/RoleBasedHeader";
import RoleBasedFooter from "@/component/Headers/RoleBasedFooter";
import Header from "@/component/Headers/Header";
import Footer from "@/component/Footer/Footer";

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
          <RoleBasedHeader></RoleBasedHeader>
          {/* <Header></Header> */}
          {children}
          {/* <Footer></Footer> */}
          <RoleBasedFooter></RoleBasedFooter>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1f1f1f",
                color: "#ffffff",
                fontSize: "13px",
                letterSpacing: "0.05em",
                padding: "14px 18px",
                borderRadius: "6px",
              },
              success: {
                iconTheme: {
                  primary: "#ffffff",
                  secondary: "#1f1f1f",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ffffff",
                  secondary: "#1f1f1f",
                },
              },
            }}
          />
        </body>
      </Providers>
    </html>
  );
}
