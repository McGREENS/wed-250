import './globals.css';
import { Heart, Menu, X } from 'lucide-react';
import { Playfair_Display, Lato } from 'next/font/google';
import Link from 'next/link';
import Providers from '@/app/components/providers';
import { auth } from "@/auth";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

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

        <Providers>

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

                  {session ? (
                    <Link
                      href="/dashboard"
                      className="bg-burgundy text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-burgundy-light transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Link
                        href="/login"
                        className="text-sm font-medium text-charcoal hover:text-burgundy transition-colors"
                      >
                        Log In
                      </Link>
                      <Link
                        href="/signup"
                        className="bg-burgundy text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-burgundy-light transition-colors shadow-md hover:shadow-lg"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-charcoal">
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </nav>

          <main className="min-h-screen">
            {children}
          </main>

          <footer className="bg-white border-t border-gray-100 mt-20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
              <div className="grid md:grid-cols-4 gap-12">
                <div>
                  <Link href="/" className="flex items-center gap-2 mb-6">
                    <div className="bg-gradient-to-r from-burgundy to-gold p-1.5 rounded-full">
                      <Heart className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold text-charcoal">Weds360</span>
                  </Link>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Making wedding planning simple, stress-free, and magical for couples in Rwanda.
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-lg text-charcoal mb-6">Platform</h4>
                  <ul className="space-y-4 text-sm text-gray-500">
                    <li><Link href="/venues" className="hover:text-burgundy">Browse Venues</Link></li>
                    <li><Link href="/vendors" className="hover:text-burgundy">Find Vendors</Link></li>
                    <li><Link href="/plan" className="hover:text-burgundy">Plan Your Wedding</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-serif text-lg text-charcoal mb-6">Company</h4>
                  <ul className="space-y-4 text-sm text-gray-500">
                    <li><Link href="/about" className="hover:text-burgundy">About Us</Link></li>
                    <li><Link href="/contact" className="hover:text-burgundy">Contact</Link></li>
                    <li><Link href="/pricing" className="hover:text-burgundy">Pricing</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-serif text-lg text-charcoal mb-6">Contact</h4>
                  <ul className="space-y-4 text-sm text-gray-500">
                    <li>support@weds360.rw</li>
                    <li>+250 788 123 456</li>
                    <li>Kigali, Rwanda</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} Weds360. All rights reserved.
              </div>
            </div>
          </footer>

        </Providers>
      </body>
    </html>
  );
}