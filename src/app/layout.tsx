import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: "400",
});

const oxaniumMono = Oxanium({
  variable: "--font-oxanium-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "K-Art - Join as Artist",
  description: "Join K-Art as an artist and get connected with top companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oxanium.variable} ${oxaniumMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
