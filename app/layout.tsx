import './globals.css';
import { Heart, Menu, X } from 'lucide-react';
import { Playfair_Display, Lato } from 'next/font/google';
import Link from 'next/link';
import Providers from '@/app/components/providers';
import { auth } from "@/auth";
import NavbarLinks from '@/app/components/layout/NavbarLinks';
import SchemaScript from '@/app/components/layout/SchemaScript';
import { generateSEOMetadata } from '@/lib/seo';
import GoogleAnalytics from '@/app/components/GoogleAnalytics';

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

export const metadata = generateSEOMetadata({});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#8B3A3A" />
        {process.env.NEXT_PUBLIC_BING_VERIFICATION && (
          <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_VERIFICATION} />
        )}
      </head>
      <body className={`min-h-screen bg-cream ${playfair.variable} ${lato.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <SchemaScript />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}