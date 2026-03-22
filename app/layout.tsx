import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'tomwm',
  description: 'Tom — designer working at the intersection of technology, organisations, and public services.',
  icons: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
