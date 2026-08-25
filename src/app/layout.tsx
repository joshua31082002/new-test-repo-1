import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aster — Make space for better work",
  description: "Aster gives ambitious teams a calmer, clearer way to move forward.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
