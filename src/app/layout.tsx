import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier North — Thoughtful spaces, made visible",
  description: "Atelier North is a small creative studio shaping brands, spaces, and stories with clarity.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
