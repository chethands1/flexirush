import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // ✅ Import Script component
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlexiRush",
  description: "Real-time interactive polls and quizzes for presentations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ OFFICE.JS INJECTION (Lazy Loaded) */}
        {/* This script enables the app to talk to PowerPoint when running as an add-in. */}
        {/* 'lazyOnload' ensures it doesn't block the initial page load for web users. */}
        <Script 
          src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js" 
          strategy="lazyOnload" 
        />
        
        {children}
      </body>
    </html>
  );
}