import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "snake. — Stay sharp",
  description: "A focused take on the timeless arcade classic.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
