import './globals.css';
import { Heart, Menu, X } from 'lucide-react';
import { Playfair_Display, Lato } from 'next/font/google';
import Link from 'next/link';
import Providers from '@/app/components/providers';
import { auth } from "@/auth";
import NavbarLinks from '@/app/components/layout/NavbarLinks';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata = {
  title: 'Andiza | #1 Wedding Planner App & Vendor Marketplace Rwanda',
  description: 'Plan your dream wedding in Rwanda with Andiza. Browse top venues, book trusted vendors, and manage your full wedding plan in one beautiful app. Start free today.',
  icons: { icon: '/favicon.ico' },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <head />
      <body className={`min-h-screen bg-cream ${playfair.variable} ${lato.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}