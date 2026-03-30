"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrivacyDataPopup from "@/components/PrivacyDataPopup";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isMap = pathname === "/map";

  if (isAdmin) {
    return <div className="min-w-0 overflow-x-clip">{children}</div>;
  }

  return (
    <div className="relative min-w-0 overflow-x-clip">
      <Header />
      <main className={isMap ? "min-h-0" : "min-h-screen"}>{children}</main>
      <Footer />
      <PrivacyDataPopup />
    </div>
  );
}
