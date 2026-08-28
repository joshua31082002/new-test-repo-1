import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mara Venn — Independent Art Direction",
  description: "Mara Venn is an independent creative director and visual storyteller.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
