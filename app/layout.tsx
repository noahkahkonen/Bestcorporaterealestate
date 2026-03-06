import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Best Corporate Real Estate | Commercial Real Estate Advisory – Columbus, OH",
    template: "%s | Best Corporate Real Estate",
  },
  description:
    "Commercial real estate advisory in Central Ohio. Brokerage services for office, retail, industrial, multifamily, and land. Columbus, Ohio.",
  keywords: ["commercial real estate", "Columbus Ohio", "Central Ohio", "brokerage", "CRE"],
  openGraph: {
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-clip">
      <body className={`${playfair.variable} ${inter.variable} min-h-screen overflow-x-clip font-sans antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
