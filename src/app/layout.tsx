import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luma — Make space for better work",
  description: "A considered workspace for teams who care about how work feels.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
