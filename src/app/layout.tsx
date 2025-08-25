import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ContextProvider from "@/context/ContextProvider";

const MonaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PREPSMASH",
  description:
    "PrepSmash is an AI-driven interview preparation platform that generates customized mock interviews tailored to your preferences. Practice interviews designed specifically for your goals, or choose from a wide range of interviews created by other users. With no real interviewer required, you can prepare anytime, receive instant feedback, and refine your skills with confidence. Elevate your interview readiness and increase your chances of success with a smart, flexible, and comprehensive preparation tool.",
  icons: "/images/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${MonaSans.className} antialiased scrollbar-thin`}>
        <ContextProvider>
          {children}
          <Toaster />
        </ContextProvider>
      </body>
    </html>
  );
}
