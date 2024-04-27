import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Linked clone 2.0",
  description: "Second Linked in version",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={`min-h-screen flex flex-col`}>
          <Toaster position="bottom-left" />
          <header className="border-b sticky z-50 top-0 bg-white">
            <Header />
          </header>
          <div className="bg-[#F4F2ED] flex-2 w-full">
            <main>{children}</main>
          </div>
        </body>
      </ClerkProvider>
    </html>
  );
}
