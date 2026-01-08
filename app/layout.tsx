// app/layout.tsx
import './globals.css';
import { Heart, Menu, X } from 'lucide-react';
import { Playfair_Display, Lato } from 'next/font/google';
import Link from 'next/link';
import Providers from '@/app/components/providers';

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
  title: 'Weds360 - Your Dream Wedding Planner',
  description: 'All-in-one wedding planning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Venues', href: '/venues' },
    { name: 'Vendors', href: '/vendors' },
    { name: 'Plan Your Wedding', href: '/plan' },
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <html lang="en">
      <head />
      <body className={`min-h-screen bg-cream ${playfair.variable} ${lato.variable} font-sans antialiased`}>

        <Providers> {/* ← SessionProvider wrapper here */}

          {/* Navigation */}
          <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
              <div className="flex justify-between items-center h-20">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-burgundy to-gold p-2 rounded-full">
                    <Heart className="w-5 h-5 text-white fill-white" />
                  </div>
                  <span className="text-2xl font-bold text-charcoal">Weds360</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-medium text-charcoal hover:text-burgundy transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/dashboard"
                    className="bg-burgundy text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-burgundy-light transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-charcoal">
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-100 mt-20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-r from-burgundy to-gold p-2 rounded-full">
                      <Heart className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold text-charcoal">Weds360</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your complete wedding planning solution. Making dream weddings come true.
                  </p>
                </div>

                {/* Quick Links, Company, Newsletter columns – same as your code */}
                {/* ... (copy-paste your footer content here) */}
              </div>

              <div className="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-600">
                © 2025 Weds360. All rights reserved. Made with ♡ for couples everywhere.
              </div>
            </div>
          </footer>

        </Providers>
      </body>
    </html>
  );
}