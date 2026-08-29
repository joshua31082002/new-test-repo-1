import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnePlus 15 | Power On. Limits Off.",
  description: "Meet OnePlus 15. The performance flagship for people who refuse to slow down.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
