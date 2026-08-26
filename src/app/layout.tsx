import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nike — Move your way",
  description: "Explore the latest Nike running shoes and gear.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
