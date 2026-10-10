import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastHost } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Timberline ERP",
  description: "Timber, gas and bio-products trading — unified back office.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
        <ToastHost />
      </body>
    </html>
  );
}
