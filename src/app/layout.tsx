import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Common Ground — Change starts closer than you think",
  description:
    "A people-powered effort helping neighbors turn shared concern into visible, local action.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
