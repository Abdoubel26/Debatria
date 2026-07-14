import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SidebarLinks from "@/lib/SidebarLinks"; // Import links to reuse here
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Debatria",
  description: "A place of Intellectual Humility and civil Debate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen overflow-y-clip bg-white dark:bg-gray-900 overflow-x-clip">
        <ThemeProvider>
          <ClerkProvider>
            <Navbar />
            
            <div className="h-[calc(100vh-61px)] pb-16 md:pb-0 flex flex-row relative">
              <Sidebar />
              {children}

              <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-50 border-t border-zinc-200/80 dark:bg-gray-950 dark:border-gray-850 z-50 shadow-lg">
                <SidebarLinks mode="bottombar" />
              </div>
            </div>

          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}