import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PRMS Admin Dashboard',
  description: 'Player Relationship Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#09090b] text-white antialiased`}>
        {/* We wrap everything in Providers to ensure State Management works everywhere */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}