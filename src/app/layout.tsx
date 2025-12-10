import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import localFont from "next/font/local";

import { Poppins } from "next/font/google";

const avenir = localFont({
  src: "../../public/fonts/avenir/AvenirNext-Regular.woff",
});

export const metadata: Metadata = {
  title: "Sakigai",
  description: "Premium Furniture Marketplace",
};

// Load POPPINS from Google Fonts
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
//   variable: "--font-poppins",
// });

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className={`${poppins.variable}`}>
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={avenir.className}>
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
