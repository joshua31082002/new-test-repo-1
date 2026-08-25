import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sonder + Form — Independent creative studio",
  description: "Brand identities and digital experiences for people building a more considered world.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
