import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tic tak toe",
  description: "A friendly two-player tic-tac-toe game.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
