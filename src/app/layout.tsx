import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "IVY: Interview AI Coach",
  description: "Website coded to allow job seekers to practice for job interviews in real time and receive instant & detailed feedback.",
  creator: "K.Mannix"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=National+Park&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-national antialiased pattern">
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

