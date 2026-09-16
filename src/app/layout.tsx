import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Northline — Ideas with room to grow',
  description: 'Northline is a brand and digital studio for ambitious organizations building a more considered future.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
